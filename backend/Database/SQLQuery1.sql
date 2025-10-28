-- =============================================
-- Database: AllenCityPharmacy
-- Description: Schema for PharmacyApp.Core.Entities
-- Compatible with: Microsoft SQL Server 2022
-- =============================================

-- 1️⃣ Create Database
CREATE DATABASE AllenCityPharmacy;
GO

USE AllenCityPharmacy;
GO

-- 2️⃣ Create Table: Users
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'Customer'
);
GO

-- 3️⃣ Create Table: Products
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    SKU NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(18,2) NOT NULL,
    StockQuantity INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- 4️⃣ Create Table: Orders
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    CustomerName NVARCHAR(200) NOT NULL,
    CustomerEmail NVARCHAR(200) NOT NULL,
    OrderDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT FK_Orders_Products FOREIGN KEY (ProductId)
        REFERENCES Products(Id) ON DELETE CASCADE
);
GO

-- ✅ Optional Indexes (for performance)
CREATE INDEX IX_Orders_ProductId ON Orders(ProductId);
CREATE INDEX IX_Products_Name ON Products(Name);
CREATE INDEX IX_Users_Username ON Users(Username);
GO

-- ✅ Done
PRINT '✅ AllenCityPharmacy database and tables created successfully.';
