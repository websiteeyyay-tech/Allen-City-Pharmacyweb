-- =============================================
-- Migration: Upgrade existing AllenCityPharmacy schema
-- Adds security, constraints, indexes, and triggers
-- =============================================

USE AllenCityPharmacy;
GO

----------------------------------------------
-- 1️⃣ Add missing columns
----------------------------------------------

-- Users table
IF COL_LENGTH('Users', 'Email') IS NULL
BEGIN
    ALTER TABLE Users
    ADD Email NVARCHAR(200) NOT NULL DEFAULT '';
END

IF COL_LENGTH('Users', 'IsVerified') IS NULL
BEGIN
    ALTER TABLE Users
    ADD IsVerified BIT NOT NULL DEFAULT 0;
END

IF COL_LENGTH('Users', 'CreatedAt') IS NULL
BEGIN
    ALTER TABLE Users
    ADD CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME();
END

IF COL_LENGTH('Users', 'UpdatedAt') IS NULL
BEGIN
    ALTER TABLE Users
    ADD UpdatedAt DATETIME2 NULL;
END

-- Products table
IF COL_LENGTH('Products', 'Category') IS NULL
BEGIN
    ALTER TABLE Products
    ADD Category NVARCHAR(150) NULL;
END

IF COL_LENGTH('Products', 'ImageUrl') IS NULL
BEGIN
    ALTER TABLE Products
    ADD ImageUrl NVARCHAR(500) NULL;
END

IF COL_LENGTH('Products', 'IsAvailable') IS NULL
BEGIN
    ALTER TABLE Products
    ADD IsAvailable BIT NOT NULL DEFAULT 1;
END

IF COL_LENGTH('Products', 'UpdatedAt') IS NULL
BEGIN
    ALTER TABLE Products
    ADD UpdatedAt DATETIME2 NULL;
END

-- Orders table
IF COL_LENGTH('Orders', 'UserId') IS NULL
BEGIN
    ALTER TABLE Orders
    ADD UserId INT NULL;
END

IF COL_LENGTH('Orders', 'UpdatedAt') IS NULL
BEGIN
    ALTER TABLE Orders
    ADD UpdatedAt DATETIME2 NULL;
END

----------------------------------------------
-- 2️⃣ Add constraints and indexes
----------------------------------------------

-- Users unique constraints
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Users_Email')
BEGIN
    CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);
END

-- Products unique constraints
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_Products_SKU')
BEGIN
    CREATE UNIQUE INDEX IX_Products_SKU ON Products(SKU);
END

-- Orders foreign keys
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name='FK_Orders_Users')
BEGIN
    ALTER TABLE Orders
    ADD CONSTRAINT FK_Orders_Users
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL;
END

-- EmailVerifications table
IF OBJECT_ID('EmailVerifications', 'U') IS NULL
BEGIN
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

    -- Indexes
    CREATE INDEX IX_EmailVerifications_UserId ON EmailVerifications(UserId);

    -- Ensure only 1 active verification per user
    CREATE UNIQUE INDEX IX_EmailVerifications_UserId_Active
    ON EmailVerifications(UserId, IsUsed)
    WHERE IsUsed = 0;
END

----------------------------------------------
-- 3️⃣ Add triggers to update UpdatedAt automatically
----------------------------------------------

-- Users trigger
IF OBJECT_ID('trg_Users_Update', 'TR') IS NULL
BEGIN
    CREATE TRIGGER trg_Users_Update
    ON Users
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE Users
        SET UpdatedAt = SYSUTCDATETIME()
        FROM inserted i
        WHERE Users.Id = i.Id;
    END;
END

-- Products trigger
IF OBJECT_ID('trg_Products_Update', 'TR') IS NULL
BEGIN
    CREATE TRIGGER trg_Products_Update
    ON Products
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE Products
        SET UpdatedAt = SYSUTCDATETIME()
        FROM inserted i
        WHERE Products.Id = i.Id;
    END;
END

-- Orders trigger
IF OBJECT_ID('trg_Orders_Update', 'TR') IS NULL
BEGIN
    CREATE TRIGGER trg_Orders_Update
    ON Orders
    AFTER UPDATE
    AS
    BEGIN
        SET NOCOUNT ON;
        UPDATE Orders
        SET UpdatedAt = SYSUTCDATETIME()
        FROM inserted i
        WHERE Orders.Id = i.Id;
    END;
END

----------------------------------------------
-- ✅ Migration completed
----------------------------------------------
PRINT '✅ AllenCityPharmacy database upgraded successfully.';
GO
