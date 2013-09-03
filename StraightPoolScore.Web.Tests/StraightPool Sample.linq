<Query Kind="Statements">
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\NLog\bin\Net4\NLog.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\RavenDB-Build-2330\EmbeddedClient\Raven.Abstractions.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\RavenDB-Build-2330\EmbeddedClient\Raven.Client.Embedded.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\RavenDB-Build-2330\EmbeddedClient\Raven.Client.Lightweight.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\RavenDB-Build-2330\EmbeddedClient\Raven.Database.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Bin\Release\Sfs.Core.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Bin\Release\Sfs.Runtime.dll</Reference>
  <Reference Relative="..\..\Source\Repos\StraightPoolScore\StraightPoolScore.Web\bin\StraightPoolScore.Web.dll">C:\Users\rtaylor\Source\Repos\StraightPoolScore\StraightPoolScore.Web\bin\StraightPoolScore.Web.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\IX\Net4\System.Interactive.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\RX\Net4\System.Reactive.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\RX\Net4\System.Reactive.Providers.dll</Reference>
  <Reference>C:\TFS\PhoenixDev\Development\2013\Common\Vendor\RX\Net4\System.Reactive.Windows.Threading.dll</Reference>
  <Namespace>Raven.Client</Namespace>
  <Namespace>Raven.Client.Document</Namespace>
  <Namespace>Raven.Client.Embedded</Namespace>
  <Namespace>Raven.Client.Linq</Namespace>
  <Namespace>Raven.Database.Server</Namespace>
  <Namespace>Raven.Imports.Newtonsoft.Json</Namespace>
  <Namespace>Raven.Imports.Newtonsoft.Json.Serialization</Namespace>
  <Namespace>StraightPoolScore.Web.Models</Namespace>
</Query>

using (var store = new DocumentStore() { Url = "http://rtaylor-lptp:8080" })
{
	store.Conventions.DefaultQueryingConsistency = ConsistencyOptions.QueryYourWrites;
	store.Initialize();

	Player p1, p2;
	StraightPoolGame game;	
	using (var session = store.OpenSession())
	{
		p1 = session.Load<Player>("players/1") ?? new Player() { Name = "Robert" };
		p2 = session.Load<Player>("players/2") ?? new Player() { Name = "Jack", Handicap = 10 };
		game = new StraightPoolGame(p1, p2, 80);
		session.Store(p1);
		session.Store(p2);
		session.Store(game);
		session.SaveChanges();
	}

//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 13, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 13, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 9, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 5, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 3, Ending = EndingType.Safety });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 14, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 13, Ending = EndingType.Safety });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 9, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 1, Ending = EndingType.Miss });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 0, Ending = EndingType.Safety });
//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 7, Ending = EndingType.Safety });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 14, Ending = EndingType.Safety });
//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 15, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 12, Ending = EndingType.Safety });
//	game.Turns.AddLast(new Turn(){ Player = p1.Id, BallsMade = 8, Ending = EndingType.Foul });
//	game.Turns.AddLast(new Turn(){ Player = p2.Id, BallsMade = 13, Ending = EndingType.Miss });

	var r = new Random();
	var p = game.Player1;
	while (true)
	{
		using (var session = store.OpenSession())
		{
			game = session.Load<StraightPoolGame>(game.Id);
			game.Turns.AddLast(new Turn() { Player = p.Id, BallsMade = r.Next(16), Ending = (EndingType)r.Next(3) });
			session.SaveChanges();
			if (game.HasGameBeenWon())
				break;
			p = p.Id == game.Player1.Id ? game.Player2 : game.Player1;
		}
	}

	using (var session = store.OpenSession())
	{
		game = session
			.Include<StraightPoolGame>(g => g.Player1.Id)
			.Include<StraightPoolGame>(g => g.Player2.Id)
			.Load(game.Id);
		p1 = session.Load<Player>(game.Player1.Id);
		p2 = session.Load<Player>(game.Player2.Id);
	}
	
	game.Turns.Buffer(2)
		.Select ((l, i) => new 
		{ 
			Inning = i, 
			Name1 = l[0].Player, 
			BallsMade1 = l[0].BallsMade, 
			Ending1 = l[0].Ending, 
			Name2 = l.Count > 1 ? l[1].Player : "", 
			BallsMade2 = l.Count > 1 ? l[1].BallsMade : 0, 
			Ending2 = l.Count > 1 ? (EndingType?)l[1].Ending : null
		})
		.Dump();
	
	game.GetPlayerStats(game.Player1).Dump("P1");
	game.GetPlayerStats(game.Player2).Dump("P2");
}
