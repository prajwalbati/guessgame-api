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
        if(req.body.guessedNumber < 0 && req.body.guessedNumber > 9.99) {
            return res.send({'message': 'Number must be between 0 to 9.99'});
        }
        let gameId = req.params.id;
        let roundId = req.params.roundId;
        let players = await userModel.find();
        let roundDetails = await gameRoundModel.findOne({_id: roundId});
        let secretNumber = roundDetails.secret_number;
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            let finalCredit = 100;
            if(player.username == "Player 1") {
                let userCredit = await userCreditModel.find({game_id: gameId, user_id: player._id}).sort({ 'created_at': -1 });
                if(userCredit && userCredit.length > 0) {
                    finalCredit = userCredit[0].final_credit;
                }
                finalCredit -= 10;
                let guessedNumber = req.body.guessedNumber;
                finalCredit = guessedNumber < secretNumber ? finalCredit + (guessedNumber * 10) : finalCredit;
                let userCreditData = {
                    game_id: gameId,
                    round_id: roundId,
                    guessed_number : guessedNumber,
                    user_id: player._id,
                    final_credit: Number(finalCredit.toFixed(2))
                };
                await new userCreditModel(userCreditData).save();
            } else {
                let userCredit = await userCreditModel.find({game_id: gameId, user_id: player._id}).sort({ 'created_at': -1 });
                if(userCredit && userCredit.length > 0) {
                    finalCredit = userCredit[0].final_credit;
                }
                finalCredit -= 10;
                let randomNumber = Number((Math.random() * 10).toFixed(2));
                finalCredit = randomNumber < secretNumber ? finalCredit + (randomNumber * 10) : finalCredit;
                let userCreditData = {
                    game_id: gameId,
                    round_id: roundId,
                    guessed_number : randomNumber,
                    user_id: player._id,
                    final_credit: Number(finalCredit.toFixed(2))
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