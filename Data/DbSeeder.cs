using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace quiz.Data
{
    public static class DbSeeder
    {
        #region Public Methods
        public static void Seed(ApplicationDbContext dbContext)
        {
            // Create default Users (if there are none)
            if (!dbContext.Users.Any())
                CreateUsers(dbContext);
            // Create default Quizzes (if there are none) together with their set of Q & A

            if (!dbContext.Quizzes.Any())
                CreateQuizzes(dbContext);
        }
        #endregion

        #region Seed Methods
        private static void CreateUsers(ApplicationDbContext dbContext)
        {
            // local variables
            DateTime createdDate = new DateTime(2019, 03, 29, 12, 30, 00);
            DateTime lastModifiedDate = DateTime.Now;

            // Create the "Admin" ApplicationUser account (if it doesn't already)
            var user_Admin = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Admin",
                Email = "admin@testmakerfree.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };

            // Insert the Admin user into the Database
            dbContext.Users.Add(user_Admin);

#if DEBUG

            // Create some sample registered user accounts (if they don't exist already)

            var user_Ryan = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Ryan",
                Email = "ryan@testmakerfree.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };

            var user_Solice = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Solice",
                Email = "solice@testmakerfree.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };

            var user_Vodan = new ApplicationUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Vodan",
                Email = "vodan@testmakerfree.com",
                CreatedDate = createdDate,
                LastModifiedDate = lastModifiedDate
            };
            // Insert sample registered users into the Database
            dbContext.Users.AddRange(user_Ryan, user_Solice, user_Vodan);
#endif
            dbContext.SaveChanges();
        }
    }
}