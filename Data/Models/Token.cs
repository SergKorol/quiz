using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace quiz.Data.Models
{
    public class Token
    {
        #region Constructor
        public Token()
        {
        }
        #endregion

        #region Properites
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string ClientId { get; set; }

        [Required]
        public string Value { get; set; }
        public int Type { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public DateTime CreateDate { get; set; }

        #endregion

        #region Lazy-Load Propperties
        /// <summary>
        /// The user related to this token
        /// </summary>
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; }
        #endregion
    }
}
