const express = require('express');
const router = express.Router();

const gameModel = require('./models/game');
const gameRoundModel = require('./models/gameRound');
const userModel = require('./models/user');
const userCreditModel = require('./models/userCredit');

router.get('/', (req, res, next) => {
    return res.send({msg: 'Welcome'});
});

router.post('/start-game', async (req, res, next) => {
    try {
        const gameData = {
            created_at: new Date()
        };
        let newGame = await new gameModel(gameData).save();

        // start round 1
        const secretNumber = Number((Math.random() * 10).toFixed(2));
        const gameRoundData = {
            game_id: newGame._id,
            round: 1,
            secret_number: secretNumber,
            created_at: new Date()
        };
        const gameRound = await new gameRoundModel(gameRoundData).save();

        let gameDetails = {
            gameId : newGame._id,
            round: gameRound.round,
            roundId: gameRound._id
        };

        return res.send({message: 'Game started', gameDetails: gameDetails});
    } catch (error) {
        return next(error);
    }
});

router.post('/:id/submit-guess/:roundId', async(req, res, next) => {
    try {
        let gameId = req.body.gameId;
        let roundId = req.body.roundId;
        let players = await userModel.find();
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if(player.username == "Player 1") {
                let guessedNumber = req.body.guessedNumber;
                let userCreditData = {
                    game_id: gameId,
                    round_id: roundId,
                    guessed_number : guessedNumber,
                    user_id: player._id
                };
                await new userCreditModel(userCreditData).save();
            } else {
                let randomNumber = Number((Math.random() * 10).toFixed(2));
                let userCreditData = {
                    game_id: gameId,
                    round_id: roundId,
                    guessed_number : randomNumber,
                    user_id: player._id
                };
                await new userCreditModel(userCreditData).save();
            }
        }
        return res.send({'message': 'Your guess number is submitted'});
    } catch (error) {
        return next(error);
    }
});

router.post('/:id/finish-game', async(req, res, next) => {
    try{
        await gameModel.findOneAndUpdate({_id: req.params.id}, {status: 'inactive'});
        return res.send({'message': 'Game is stopped'});
    } catch (error) {
        return next(error);
    }
});

module.exports = router;