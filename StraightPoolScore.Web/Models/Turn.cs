using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore.Web.Models
{
    public class Turn
    {
        public string Player { get; set; }
        public EndingType Ending { get; set; }
        public int BallsMade { get; set; }
    }
}
