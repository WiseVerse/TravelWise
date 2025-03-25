using Microsoft.EntityFrameworkCore;
using TravelWise.Model.Configuration;
using TravelWise.Model.Entities;
var builder = WebApplication.CreateBuilder(args);

// Connection String aus appsettings.json abrufen
var connectionString = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING");

builder.Services.AddDbContext<TravelWiseContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.Run();




