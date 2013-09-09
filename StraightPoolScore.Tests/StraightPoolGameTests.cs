using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Diagnostics;

namespace StraightPoolScore.Tests
{
    [TestClass]
    public class StraightPoolGameTests
    {
        [TestMethod]
        public void CurrentPlayerStartsWithPlayer1()
        {
            var p1 = new Player("A", 0) { Id = "a" };
            var p2 = new Player("B", 0) { Id = "b" };

            var game = new StraightPoolGame(p1, p2, 100);

            Assert.AreEqual(p1.Id, game.CurrentPlayerId);
        }

        [TestMethod]
        public void ConsecutiveFouls()
        {
            var p1 = new Player("A", 0) { Id = "a" };
            var p2 = new Player("B", 0) { Id = "b" };

            var game = new StraightPoolGame(p1, p2, 100);

            game.EndTurn(15, EndingType.Foul);
            game.EndTurn(15, EndingType.Safety);
            game.EndTurn(15, EndingType.Foul);
            game.EndTurn(15, EndingType.Safety);
            game.EndTurn(15, EndingType.Foul);

            Assert.AreEqual(-18, p1.Score);
            Assert.AreEqual(0, p1.ConsecutiveFouls);
            Assert.AreEqual(p1.Id, game.CurrentPlayerId);
        }

        [TestMethod]
        public void BreakingFouls()
        {
            var p1 = new Player("A", 0) { Id = "a" };
            var p2 = new Player("B", 0) { Id = "b" };

            var game = new StraightPoolGame(p1, p2, 100);

            game.EndTurn(15, EndingType.BreakingFoul);
            game.NextPlayer(); // p2 decides to return play to P1 to rebreak
            game.EndTurn(15, EndingType.BreakingFoul);
            game.EndTurn(1, EndingType.Miss);

            Assert.AreEqual(p1.Score, -4);
            Assert.AreEqual(p2.Score, 14);
        }
    }
}
