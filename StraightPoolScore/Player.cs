using System;
using System.Collections.Generic;
using System.Linq;

namespace StraightPoolScore
{
    public class Player : IEquatable<Player>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Handicap { get; set; }

        public override bool Equals(object obj)
        {
            if (!(obj is Player))
                return false;

            return Equals(obj as Player);
        }

        public override int GetHashCode()
        {
            return EqualityComparer<string>.Default.GetHashCode(Id)
                ^ EqualityComparer<string>.Default.GetHashCode(Name)
                ^ EqualityComparer<int>.Default.GetHashCode(Handicap);
        }

        public override string ToString()
        {
            return string.Format("{1} ({0}); Handicap = {2}", Id, Name, Handicap);
        }

        public bool Equals(Player other)
        {
            return this.Id == other.Id
                && this.Name == other.Name
                && this.Handicap == other.Handicap;
        }
    }
}
