function Game($scope) {
    // TODO: lift the properties to $scope; get rid of .model
    $scope.model = {
        player1: {
            name: "Robert",
            score: 88,
            foul1: false,
            foul2: false,
            foul3: false,
            image: "",
        },
        player2 : {
            name : "Taylor",
            score : 66,
            foul1: true,
            foul2: true,
            foul3: false,
            image: "",
        },

        showScoring: true,
        showDetails: false,
        showStats: false,

        maxBalls: 15,
        ballsRemaining: 15,
        isOpeningRack: true,
        isAfterBreakingFoul: false,

        canSwitch: function()
        {
            return $scope.model.isOpeningRack && $scope.model.ballsRemaining == $scope.model.maxBalls;
        }
    };

    $scope.inc = function () {
        if ($scope.model.ballsRemaining < $scope.model.maxBalls)
            $scope.model.ballsRemaining++;
    };

    $scope.dec = function () {
        if ($scope.model.ballsRemaining > 1)
            $scope.model.ballsRemaining--;
    };

    $scope.miss = function () { };

    $scope.foul = function () { };

    $scope.safe = function () { };

    $scope.breakingFoul = function () { };

    $scope.rebreak = function () { };

    $scope.newRack = function () { };
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
