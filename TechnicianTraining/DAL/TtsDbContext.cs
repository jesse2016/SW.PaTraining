using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TechnicianTraining.Training.Models;

namespace TechnicianTraining.DAL
{
    public class TtsDbContext : DbContext
    {
        public TtsDbContext() : base("DefaultConnection")
        {
        }

        public DbSet<Node> Nodes { get; set; }
        public DbSet<ArticleDetail> ArticleDetail { get; set; }
    }
}