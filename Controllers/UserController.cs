using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using quiz.ViewModels;
using quiz.Data;
using Mapster;

namespace quiz.Controllers
{
    public class UserController : BaseApiController
    {

        #region Constructor
        public UserController(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration
            )
            : base(context, roleManager, userManager, configuration) { }
        #endregion

        #region RESTful Conventions
        /// <summary>
        /// PUT: api/user
        /// </summary>
        /// <returns>Creates a new User and return it accordingly.</returns>
        [HttpPut()]
        public async Task<IActionResult> Put([FromBody]UserViewModel model)
        {
            // return a generic HTTP Status 500 (Server Error)
            // if the client payload is invalid.
            if (model == null) return new StatusCodeResult(500);

            // check if the Username/Email already exists
            ApplicationUser user = await UserManager.FindByNameAsync(model.UserName);
            if (user != null) return BadRequest("Username already exists");

            user = await UserManager.FindByEmailAsync(model.Email);
            if (user != null) return BadRequest("Email already exists.");



            var now = DateTime.Now;

            // create a new Item with the client-sent json data
            user = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.UserName,
                Email = model.Email,
                DisplayName = model.DisplayName,
                CreatedDate = now,
                LastModifiedDate = now
            };

            // Add the user to the Db with the choosen password
            await UserManager.CreateAsync(user, model.Password);

            // Assign the user to the 'RegisteredUser' role.
            await UserManager.AddToRoleAsync(user, "RegisteredUser");

            // Remove Lockout and E-Mail confirmation
            //user.EmailConfirmed = true;
            //user.LockoutEnabled = false;

            // persist the changes into the Database.
            DbContext.SaveChanges();

            // return the newly-created User to the client.
            return Json(user.Adapt<UserViewModel>(),
                JsonSettings);
        }

        /////<summary>
        ///// POST: api/user
        ///// </summary>
        ///// <returns>Creates a new User and returns it accordingly.</returns>
        //public async Task<IActionResult> Add([FromBody] UserViewModel model)
        //{
        //    if (model == null)
        //    {
        //        return BadRequest();
        //    }

        //    var user = await this.UserManager.FindByNameAsync(model.UserName);

        //    if (user != null)
        //    {
        //        return BadRequest("User already exists.");
        //    }

        //    var now = DateTime.UtcNow;

        //    user = new ApplicationUser
        //    {
        //        SecurityStamp = Guid.NewGuid().ToString(),
        //        UserName = model.UserName,
        //        Email = model.Email,
        //        DisplayName = model.DisplayName,
        //        CreatedDate = now,
        //        LastModifiedDate = now
        //    };

        //    await this.UserManager.CreateAsync(user, model.Password);

        //    await this.UserManager.AddToRoleAsync(user, "RegisteredUser");

        //    user.EmailConfirmed = true;
        //    user.LockoutEnabled = false;

        //    this.DbContext.SaveChanges();

        //    return Json(user.Adapt<UserViewModel>(), this.JsonSettings);
        //}

        #endregion
    }
}
