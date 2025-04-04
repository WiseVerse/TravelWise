using System;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TravelWise.Bl.Interfaces;
using TravelWise.Bl.Services;
using TravelWise.Domain.Interfaces;
using TravelWise.Domain.Repository;
using TravelWise.Model.Configuration;
using User = TravelWise.Model.Entities.User;

var builder = WebApplication.CreateBuilder(args);

# region default settings

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    c =>
    {
        var securityScheme = new OpenApiSecurityScheme
        {
            Name = "JWT Authentication",
            Description = "Enter your JWT token in this field",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT"
        };

        c.AddSecurityDefinition("Bearer", securityScheme);

        var securityRequirement = new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                []
            }
        };

        c.AddSecurityRequirement(securityRequirement);
    });

builder.Services.AddControllers();

// builder.Configuration.AddEnvironmentVariables().AddJsonFile("appsettings.Development.json");

string connection = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");

if (connection is null)
    throw new InvalidOperationException("AZURE_SQL_CONNECTIONSTRING is missing from configuration");

builder.Services.AddDbContextFactory<TravelWiseContext>(
    options => options.UseSqlServer(connection, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 2,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        );
    }));

# endregion

# region jwt

var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

if (jwtKey is null)
{
    throw new InvalidOperationException("Jwt:Key is missing from configuration");
}

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<TravelWiseContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
    {
        {
            options.DefaultAuthenticateScheme =
                options.DefaultChallengeScheme =
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
        };
    });

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_@.";
    options.User.RequireUniqueEmail = false;
});

# endregion

# region repositories
builder.Services.AddTransient<IUserRepository, UserRepository>();
# endregion

# region services
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<ITokenManagerService, TokenManagerService>();
builder.Services.AddTransient<IEmailSender<User>, DummyEmailSender>();
# endregion

# region cors

builder.Services.AddCors(
    options =>
    {
        options.AddDefaultPolicy(
            policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
    });

var app = builder.Build();

app.UseCors();

# endregion

# region auth middleware

app.UseAuthentication();
app.UseAuthorization();

app.MapIdentityApi<User>();

# endregion

# region swagger

// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI();
// }

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

# endregion