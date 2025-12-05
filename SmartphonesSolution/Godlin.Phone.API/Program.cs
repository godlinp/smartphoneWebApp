using Godlin.Phone.API.Context;
using Godlin.Phone.API.Repositories.ManufacturerRepo;
using Godlin.Phone.API.Repositories.PhoneSpecificationRepo;
using Godlin.Phone.API.Repositories.SmartphoneRepo;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IManufacturerRepository, ManufacturerRepository>();
builder.Services.AddScoped<IPhoneSpecRepository, PhoneSpecRepository>(); 
builder.Services.AddScoped<ISmartphoneRepository, SmartphoneRepository>();

builder.Services.AddDbContext<SmartPhonesDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Smartphone");
    options.UseSqlServer(connectionString);
});

builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<SmartPhonesDbContext>().AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("MyPolicy");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapIdentityApi<IdentityUser>();

app.MapControllers();

app.Run();