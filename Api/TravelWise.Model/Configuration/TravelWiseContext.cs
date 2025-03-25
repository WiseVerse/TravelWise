using TravelWise.Model.Entities;
namespace TravelWise.Model.Configuration;
using Microsoft.EntityFrameworkCore;

public class TravelWiseContext : DbContext
{
    public TravelWiseContext(DbContextOptions<TravelWiseContext> options) : base(options) { }
    
    public TravelWiseContext() {}

    public DbSet<User> Users { get; set; }
    public DbSet<Trip> Trips { get; set; }
    public DbSet<TripLocation> TripLocations { get; set; }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=tcp:travelwise.database.windows.net,1433;Initial Catalog=travelwise;Persist Security Info=False;User ID=TravelWiseadmin;Password=2MW]kWi'ac8mTNx;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(u => u.Trips)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Trip>()
            .HasMany(t => t.TripLocations)
            .WithOne(tl => tl.Trip)
            .HasForeignKey(tl => tl.TripId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
