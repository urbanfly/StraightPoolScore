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
            var p1 = new Player("Players/1", "Robert", 0);
            var p2 = new Player("Players/2", "Jack", 10);
            var game = new StraightPoolGame(p1, p2, 80);
            var game2 = new StraightPoolGame(p1, p2, 80);

            game2.Turns.AddLast(new Turn(p1.Id, 13, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p2.Id, 13, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p1.Id, 9, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p2.Id, 5, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p1.Id, 3, EndingType.Safety));
            game2.Turns.AddLast(new Turn(p2.Id, 14, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p1.Id, 13, EndingType.Safety));
            game2.Turns.AddLast(new Turn(p2.Id, 9, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p1.Id, 1, EndingType.Miss));
            game2.Turns.AddLast(new Turn(p2.Id, 0, EndingType.Safety));
            game2.Turns.AddLast(new Turn(p1.Id, 7, EndingType.Safety));
            game2.Turns.AddLast(new Turn(p2.Id, 14, EndingType.Safety));
            game2.Turns.AddLast(new Turn(p1.Id, 15, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p2.Id, 12, EndingType.Safety));
            game2.Turns.AddLast(new Turn(p1.Id, 8, EndingType.Foul));
            game2.Turns.AddLast(new Turn(p2.Id, 13, EndingType.Win));

            //--- 13
            game.EndTurn(2, EndingType.Foul);
            //---13
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(3, EndingType.Foul);
            //---9
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(8, EndingType.Foul);
            //---5
            game.EndTurn(3, EndingType.Foul);
            //---3
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(14, EndingType.Safety);
            //---14
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(14, EndingType.Foul);
            //---13
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(15, EndingType.Safety);
            //---9
            game.EndTurn(6, EndingType.Foul);
            //---1
            game.EndTurn(5, EndingType.Miss);
            //---0
            game.EndTurn(5, EndingType.Safety);
            //---7
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(12, EndingType.Safety);
            //---14
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(12, EndingType.Safety);
            //---15
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(11, EndingType.Foul);
            //---12
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(13, EndingType.Safety);
            //---8
            game.EndTurn(5, EndingType.Foul);
            //---13
            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(6, EndingType.Win);

            var stats = game.GetPlayerStats(game.Player2);

            Assert.AreEqual(80, stats.NumberOfBallsMade);
            Assert.AreEqual(8, stats.NumberOfInnings);
            Assert.AreEqual(10, stats.AverageBallsBetweenErrors);

            CollectionAssert.AreEqual(game.Turns, game2.Turns);
        }

        [TestMethod]
        public void Game2()
        {
            var p1 = new Player("Players/1", "Robert", 0);
            var p2 = new Player("Players/2", "Jack", 10);
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

        [TestMethod]
        public void NewRack()
        {
            var p1 = new Player("Players/1", "Robert", 0);
            var p2 = new Player("Players/2", "Jack", 10);
            var game = new StraightPoolGame(p1, p2, 80);

            game.EndTurn(1, EndingType.NewRack);
            game.EndTurn(1, EndingType.NewRack);

            var stats1 = game.GetPlayerStats(game.Player1);
            var stats2 = game.GetPlayerStats(game.Player2);

            Assert.AreEqual(28, stats1.NumberOfBallsMade);
            Assert.AreEqual(0, stats2.NumberOfBallsMade);
            Assert.AreEqual(1, stats1.NumberOfInnings);
        }
    }

    [TestClass]
    public class StraightPoolGameTests
    {
        [TestMethod]
        public void CurrentPlayerStartsWithPlayer1()
        {
            var p1 = new Player("a", "A", 0);
            var p2 = new Player("b", "B", 0);

            var game = new StraightPoolGame(p1, p2, 100);

            Assert.AreEqual(p1.Id, game.CurrentPlayerId);
        }

        [TestMethod]
        public void BreakingFouls()
        {
            var p1 = new Player("a", "A", 0);
            var p2 = new Player("b", "B", 0);

            var game = new StraightPoolGame(p1, p2, 100);

            game.EndTurn(15, EndingType.BreakingFoul);
            game.NextPlayer();
            game.EndTurn(15, EndingType.BreakingFoul);
            game.EndTurn(1, EndingType.Miss);

            Assert.AreEqual(p1.Score, -4);
            Assert.AreEqual(p2.Score, 14);
        }
    }
}
