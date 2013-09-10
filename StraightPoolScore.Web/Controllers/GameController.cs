using Raven.Abstractions.Exceptions;
using Raven.Abstractions.Logging;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace StraightPoolScore.Web.Controllers
{
    public class GameController : RavenController
    {
        //
        // GET: /Game/

        public ActionResult Index()
        {
            var games = RavenSession.Query<StraightPoolGame>();
            return View(games);
        }

        //
        // GET: /Game/Details/5

        public ActionResult Details(int id)
        {
            var game = RavenSession.Load<StraightPoolGame>(id);
            return View(game);
        }

        //
        // GET: /Game/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Game/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                var p1 = new Player(collection["Player1.Name"], int.Parse(collection["Player1.Handicap"]));
                var p2 = new Player(collection["Player2.Name"], int.Parse(collection["Player2.Handicap"]));
                RavenSession.Store(p1);
                RavenSession.Store(p2);

                var game = new StraightPoolGame(p1, p2, int.Parse(collection["Limit"]));
                RavenSession.Store(game);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Game/Edit/5

        public ActionResult Edit(int id)
        {
            var game = RavenSession.Load<StraightPoolGame>(id);
            return View(game);
        }

        //
        // POST: /Game/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Game/Delete/5

        public ActionResult Delete(int id)
        {
            var game = RavenSession.Load<StraightPoolGame>(id);
            return View(game);
        }

        //
        // POST: /Game/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                var game = RavenSession.Load<StraightPoolGame>(id);
                RavenSession.Delete(game);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
