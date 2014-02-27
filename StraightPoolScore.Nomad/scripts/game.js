function Game($scope) {
    $scope.player1 = {
        name: "Robert",
        score: 88,
        foul1: false,
        foul2: false,
        foul3: false,
        image: "",
    };

    $scope.player2 = {
        name : "Taylor",
        score : 66,
        foul1: true,
        foul2: true,
        foul3: false,
        image: "",
    };

    $scope.canSwitch = function () {
        return $scope.scoring.isOpeningRack && $scope.scoring.ballsRemaining == $scope.scoring.maxBalls;
    };

    $scope.switchPlayers = function () {
        var p1 = $scope.player1;
        $scope.player1 = $scope.player2;
        $scope.player2 = p1;
    };

    $scope.visiblePanel = "scoring";

    $scope.scoring = {
        maxBalls: 15,
        ballsRemaining: 15,
        isOpeningRack: true,
        isAfterBreakingFoul: false,

        inc : function () {
            if ($scope.scoring.ballsRemaining < $scope.scoring.maxBalls)
                $scope.scoring.ballsRemaining++;
        },

        dec : function () {
            if ($scope.scoring.ballsRemaining > 1)
                $scope.scoring.ballsRemaining--;
        },

        miss : function () { },

        foul : function () { },

        safe : function () { },

        breakingFoul : function () { },

        rebreak : function () { },

        newRack: function () { },

        // TODO: How to implement newRack-with-15th-ball
    };

    $scope.innings = [
        {
            num: 1,
            p1: { score: 0, ballsMade: 0, ending: "BreakingFoul" },
            p2: { score: 0, ballsMade: 0, ending: "BreakingFoul" }
        }
    ];

    $scope.stats = [
        { name: "Total Balls", p1: 88, p2: 68 }
    ];
}

document.addEventListener("deviceready", function () {
    var auth0 = new Auth0Client(
        "straightpoolscore.auth0.com",
        "DHiWNztSKgcxgmYq1rhvq6reTJyoj9nY");

    auth0.login(function (err, result) {
        if (err) return err;
        alert(result.profile.email);
        /* 
        Use result to do wonderful things, e.g.: 
            - get user email => result.profile.email
            - get facebook/google/twitter/etc access token => result.profile.identities[0].access_token
            - get Windows Azure AD groups => result.profile.groups
            - etc.
        */
    });
});
