"use strict";

const express = require('express');
const { createServer, Server } = require('http');
const loaders = require('./loaders');
const userCreditModel = require('./models/userCredit');
const gameRoundModel = require('./models/gameRound');
const userModel = require('./models/user');

const dotenv = require('dotenv');
dotenv.config();

let startServer = async() => {
    const app = express();
    await loaders.init(app);

    let server = app.listen(process.env.PORT, err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Express running at port: ${process.env.PORT} -> ${process.env.APP_URL}:${process.env.PORT}`);
    });
    var io = require('socket.io')(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        socket.on('creditUpdate', async(data) => {
            // emit the credits data
            let roundId = data.roundId;
            let gameId = data.gameId;
            let round = data.round;

            let emitData = [];
            let players = await userModel.find();
            let gameRounds = await gameRoundModel.find({game_id: gameId}).sort({created_at: 1});
            for (let i = 0; i < gameRounds.length; i++) {
                const gameRound = gameRounds[i];
                let roundData = {
                    round: gameRound.round,
                    secret: gameRound.secret_number,
                };
                for (let i = 0; i < players.length; i++) {
                    let player = players[i];
                    let userCredit = await userCreditModel.findOne({user_id: player._id, round_id: gameRound._id}).sort({ 'created_at': 1 });
                    if(userCredit) {
                        roundData[player.username] =  {
                            guessNumber: userCredit.guessed_number,
                            credit: userCredit.final_credit
                        }
                    }
                }
                emitData.push(roundData);
            }

            const secretNumber = Number((Math.random() * 10).toFixed(2));
            const gameRoundData = {
                game_id: gameId,
                round: gameRounds.length + 1,
                secret_number: secretNumber,
                created_at: new Date()
            };
            const newGameRound = await new gameRoundModel(gameRoundData).save();
            let gameDetails = {
                gameId : gameId,
                round: newGameRound.round,
                roundId: newGameRound._id
            };
            io.emit('creditUpdated', {emitData, gameDetails});
        });

    });
};
startServer();