# Database Seeding Instructions for Clario Project

## Prerequisites

The seeding script requires a running PostgreSQL database. You have several options:

### Option 1: Start Docker Desktop and PostgreSQL Container (Recommended)

1. **Start Docker Desktop:**
   - Make sure Docker Desktop is installed and running on your system
   - You should see the Docker icon in your system tray

2. **Start the PostgreSQL container:**
   ```bash
   cd C:/Users/hp/Documents/GitHub/clario-dbms/infra
   docker-compose up -d
   ```

3. **Wait for the database to be ready:**
   ```bash
   docker-compose logs postgres
   ```
   Look for "database system is ready to accept connections"

### Option 2: Use Local PostgreSQL Installation

If you have PostgreSQL installed locally:

1. **Update the DATABASE_URL in `.env`:**
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/clario?schema=public"
   ```

2. **Create the database:**
   ```sql
   CREATE DATABASE clario;
   CREATE USER clario WITH PASSWORD 'clario';
   GRANT ALL PRIVILEGES ON DATABASE clario TO clario;
   ```

### Option 3: Use SQLite for Development (Alternative)

If you want to use SQLite instead of PostgreSQL for development:

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. **Update `.env`:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

## Running the Seed Script

Once your database is running:

1. **Generate Prisma Client:**
   ```bash
   cd backend
   npx prisma generate
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

3. **Run the seed script:**
   ```bash
   npx prisma db seed
   ```

## Expected Output

When successful, you should see:
```
🌱 Starting database seeding...
📚 Seeding Learning Types...
✅ Created/Updated Learning Types: Visual, Auditory, Kinesthetic
🎥 Seeding Sample Videos...
✅ Created 8 sample videos
🏷️ Seeding Video Tags...
✅ Created 24 video tags linking videos to learning types

🎉 Database seeding completed successfully!

📊 Seeding Summary:
   • Learning Types: 3 (Visual, Auditory, Kinesthetic)
   • Videos: 8 sample videos with realistic content
   • Video Tags: 24 tags with learning type scores

🚀 Your Clario database is now ready for testing!
```

## Troubleshooting

### Common Issues:

1. **"User was denied access on the database"**
   - Ensure the database user has proper permissions
   - Check that the DATABASE_URL credentials are correct

2. **"Connection refused"**
   - Ensure PostgreSQL is running
   - Check that the port (5432) is correct and not blocked

3. **"Database does not exist"**
   - Create the database first using the SQL commands above
   - Or run `npx prisma migrate dev` to create it automatically

4. **TypeScript compilation errors**
   - Ensure ts-node is installed: `npm install -D ts-node`
   - Check that the prisma client is generated: `npx prisma generate`

## Verifying the Seeded Data

After successful seeding, you can verify the data:

```bash
# Connect to your database and run:
SELECT * FROM "LearningType";
SELECT * FROM "Video";
SELECT * FROM "VideoTag";
```

Or use Prisma Studio:
```bash
npx prisma studio
```

## Next Steps

1. **Test the video search API** with the seeded data
2. **Create test users** with different learning types
3. **Verify personalized recommendations** work correctly
4. **Test the scoring algorithms** with the video tags

The seeded data includes:
- 3 learning types (Visual, Auditory, Kinesthetic)
- 8 diverse educational videos
- 24 video tags with realistic scoring for each learning type

This provides a solid foundation for testing all the video recommendation and scoring features!