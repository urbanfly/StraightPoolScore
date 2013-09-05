using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Diagnostics;

namespace StraightPoolScore.Tests
{
    [TestClass]
    public class PlayerStatsTests
    {
        [TestMethod]
        public void Game1()
        {
            var p1 = new Player() { Id = "Players/1", Name = "Robert" };
            var p2 = new Player() { Id = "Players/2", Name = "Jack", Handicap = 10 };
            var game = new StraightPoolGame(p1, p2, 80);

            game.Turns.AddLast(new Turn(p1.Id, 13, EndingType.Foul));
            game.Turns.AddLast(new Turn(p2.Id, 13, EndingType.Foul));
            game.Turns.AddLast(new Turn(p1.Id, 9, EndingType.Foul));
            game.Turns.AddLast(new Turn(p2.Id, 5, EndingType.Foul));
            game.Turns.AddLast(new Turn(p1.Id, 3, EndingType.Safety));
            game.Turns.AddLast(new Turn(p2.Id, 14, EndingType.Foul));
            game.Turns.AddLast(new Turn(p1.Id, 13, EndingType.Safety));
            game.Turns.AddLast(new Turn(p2.Id, 9, EndingType.Foul));
            game.Turns.AddLast(new Turn(p1.Id, 1, EndingType.Miss));
            game.Turns.AddLast(new Turn(p2.Id, 0, EndingType.Safety));
            game.Turns.AddLast(new Turn(p1.Id, 7, EndingType.Safety));
            game.Turns.AddLast(new Turn(p2.Id, 14, EndingType.Safety));
            game.Turns.AddLast(new Turn(p1.Id, 15, EndingType.Foul));
            game.Turns.AddLast(new Turn(p2.Id, 12, EndingType.Safety));
            game.Turns.AddLast(new Turn(p1.Id, 8, EndingType.Foul));
            game.Turns.AddLast(new Turn(p2.Id, 13, EndingType.Miss));

            var stats = game.GetPlayerStats(game.Player2);

            Assert.AreEqual(80, stats.NumberOfBallsMade);
            Assert.AreEqual(8, stats.NumberOfInnings);
            Assert.AreEqual(10, stats.AverageBallsBetweenErrors);
        }

        [TestMethod]
        public void Game2()
        {
            var p1 = new Player() { Id = "Players/1", Name = "Robert" };
            var p2 = new Player() { Id = "Players/2", Name = "Jack", Handicap = 10 };
            var game = new StraightPoolGame(p1, p2, 80);

            game.Turns.AddLast(new Turn(p1.Id, 7, EndingType.Safety));
            game.Turns.AddLast(new Turn(p2.Id, 0, EndingType.Safety));
            game.Turns.AddLast(new Turn(p1.Id, 6, EndingType.Foul));
            game.Turns.AddLast(new Turn(p2.Id, 13, EndingType.Safety));
            game.Turns.AddLast(new Turn(p1.Id, 9, EndingType.Safety));
            game.Turns.AddLast(new Turn(p2.Id, 2, EndingType.Foul));

            var stats = game.GetPlayerStats(game.Player1);

            Assert.AreEqual(11, stats.AverageBallsBetweenErrors);
        }
    }
}
