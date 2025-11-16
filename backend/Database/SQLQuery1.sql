-- =============================================
-- Database: AllenCityPharmacy
-- Description: Secure Schema for PharmacyApp.Core.Entities
-- Compatible with: Microsoft SQL Server 2022
-- =============================================

-- 1️⃣ Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AllenCityPharmacy')
BEGIN
    CREATE DATABASE AllenCityPharmacy;
END
GO

USE AllenCityPharmacy;
GO

-- 2️⃣ Create Table: Users
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(200) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(50) NOT NULL DEFAULT 'Customer',
    IsVerified BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- 3️⃣ Create Table: Products
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    SKU NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(18,2) NOT NULL CHECK (Price >= 0),
    StockQuantity INT NOT NULL CHECK (StockQuantity >= 0),
    Category NVARCHAR(150) NULL,
    ImageUrl NVARCHAR(500) NULL,
    IsAvailable BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL
);
GO

-- 4️⃣ Create Table: Orders
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    UserId INT NULL,  -- MUST be nullable for ON DELETE SET NULL!
    Quantity INT NOT NULL CHECK (Quantity > 0),
    TotalPrice DECIMAL(18,2) NOT NULL CHECK (TotalPrice >= 0),
    CustomerName NVARCHAR(200) NOT NULL,
    CustomerEmail NVARCHAR(200) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    OrderDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,

    CONSTRAINT FK_Orders_Products FOREIGN KEY (ProductId)
        REFERENCES Products(Id) ON DELETE NO ACTION,

    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId)
        REFERENCES Users(Id) ON DELETE SET NULL
);
GO

-- 5️⃣ Create Table: EmailVerifications
CREATE TABLE EmailVerifications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    CodeHash NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    FailedAttempts INT NOT NULL DEFAULT 0,
    IsUsed BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,

    CONSTRAINT FK_EmailVerifications_Users FOREIGN KEY (UserId)
        REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- 6️⃣ Indexes (Performance)
CREATE INDEX IX_Products_Name ON Products(Name);
CREATE INDEX IX_Products_Category ON Products(Category);

CREATE INDEX IX_Orders_ProductId ON Orders(ProductId);
CREATE INDEX IX_Orders_UserId ON Orders(UserId);
CREATE INDEX IX_Orders_CustomerEmail ON Orders(CustomerEmail);

CREATE INDEX IX_EmailVerifications_UserId ON EmailVerifications(UserId);

-- Ensures 1 active verification code per user
CREATE UNIQUE INDEX IX_EmailVerifications_UserId_Active
ON EmailVerifications(UserId, IsUsed)
WHERE IsUsed = 0;
GO

-- 7️⃣ Users extra indexes
CREATE INDEX IX_Users_Email ON Users(Email);
GO

PRINT '✅ AllenCityPharmacy database and tables created successfully.';
