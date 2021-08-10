/*
 * "Skeet Shooting": A retro-style skeet shooting game
 * Copyright (C) 2021  Salvatore Michele Rago
 *
 * This file is part of Skeet Shooting
 *
 * Skeet Shooting is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Skeet Shooting is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Skeet Shooting.  If not, see <http://www.gnu.org/licenses/>.
 */

// const UI_CONT_HEIGHT = height()/2;
const UI_CONT_WIDTH = width()/5.5;
const UI_CONT_SIDE_DIM = 2;
const UI_CONT_MARGIN = 5;
const UI_CONT_HEIGHT = 20*UI_CONT_MARGIN;
const UI_CONT_BOTT_RIGHT = vec2(width() - UI_CONT_MARGIN, height() - UI_CONT_MARGIN);
const UI_CONT_TOP_LEFT = UI_CONT_BOTT_RIGHT.sub(UI_CONT_WIDTH, UI_CONT_HEIGHT);
const UI_CONTENT_MARGIN = 8;
const SPRITES_SIZE = 12;

const BRONZE_SCORE = 10;
const SILVER_SCORE = 20;
const GOLD_SCORE = 30;
const OLYMP_REC_SCORE = 50;
const WORLD_REC_SCORE = 80;

// The game metadata
let playerScore = 0;
let playerNumLives = 3;

// Whether the game is playing or in pause
let paused = false;

loadSprite('heart', './sprites/heart.png');
loadSprite('gold_medal', './sprites/gold_medal.png');
loadSprite('silver_medal', './sprites/silver_medal.png');
loadSprite('bronze_medal', './sprites/bronze_medal.png');
loadSprite('oly_rec', './sprites/oly_rec.png');
loadSprite('world_rec', './sprites/world_rec.png');
loadSprite('pause', './sprites/pause.png')
loadSprite('play', './sprites/play.png')

class GoalData {
    constructor(score, eventName, sprite) {
        this.score = score;
        this.eventName = eventName;
        this.sprite = sprite;
    }
}

function buildContainer() {
    add([
        rect(UI_CONT_WIDTH, UI_CONT_HEIGHT),
        pos(UI_CONT_BOTT_RIGHT),
        origin('botright'),
        color(0.4, 0.7, 1, 0.8),
        layer('ui')
    ]);
    // The container top side
    add([
        rect(UI_CONT_WIDTH, UI_CONT_SIDE_DIM),
        pos(UI_CONT_BOTT_RIGHT.sub(0, UI_CONT_HEIGHT)),
        origin('botright'),
        color(0, 0.35, 0.7),
        layer('ui'),
    ]);
    // The container bottom side
    add([
        rect(UI_CONT_WIDTH, UI_CONT_SIDE_DIM),
        pos(UI_CONT_BOTT_RIGHT),
        origin('botright'),
        color(0, 0.35, 0.7),
        layer('ui'),
    ]);
    // The container right side
    add([
        rect(UI_CONT_SIDE_DIM, UI_CONT_HEIGHT + (UI_CONT_SIDE_DIM)),
        pos(UI_CONT_BOTT_RIGHT),
        origin('botright'),
        color(0, 0.35, 0.7),
        layer('ui'),
    ]);
    // The container left side
    add([
        rect(UI_CONT_SIDE_DIM, UI_CONT_HEIGHT + (UI_CONT_SIDE_DIM)),
        pos(UI_CONT_BOTT_RIGHT.sub(UI_CONT_WIDTH, 0)),
        origin('botright'),
        color(0, 0.35, 0.7),
        layer('ui'),
    ]);
}

function buildNumOfLives() {
    drawText("Lives: ", {
        size: UI_CONTENT_MARGIN,
        pos: UI_CONT_TOP_LEFT.add(UI_CONTENT_MARGIN, 4*UI_CONTENT_MARGIN),
    });
    for(let i = 0; i < playerNumLives; i++) {
        drawSprite('heart', {
            height: SPRITES_SIZE,
            pos: UI_CONT_TOP_LEFT.add(
                UI_CONT_WIDTH-(SPRITES_SIZE*(i+1)),
                5*UI_CONTENT_MARGIN
            ),
            origin: 'botright'
        });
    }
}

// Returns the score, event name and sprite of the next goal
function getNextGoalData() {
    if(playerScore < BRONZE_SCORE) {
        return new GoalData(BRONZE_SCORE, 'BRONZE', 'bronze_medal');
    } else if(playerScore < SILVER_SCORE) {
        return new GoalData(SILVER_SCORE, 'SILVER', 'silver_medal');
    } else if(playerScore < GOLD_SCORE) {
        return new GoalData(GOLD_SCORE, 'GOLD', 'gold_medal');
    } else if(playerScore < OLYMP_REC_SCORE) {
        return new GoalData(OLYMP_REC_SCORE, 'OLYMPIC REC', 'oly_rec');
    } else if(playerScore < WORLD_REC_SCORE) {
        return new GoalData(WORLD_REC_SCORE, 'WORLD REC', 'world_rec');
    } else {
        return null;
    }
}

function buildNextGoal() {
    let nextGoal = getNextGoalData();
    if(nextGoal === null) return;

    drawText('Next goal: ' + nextGoal.score, {
        size: UI_CONTENT_MARGIN,
        pos: UI_CONT_TOP_LEFT.add(UI_CONTENT_MARGIN, 6*UI_CONTENT_MARGIN),
    });
    drawText(nextGoal.eventName, {
        size: UI_CONTENT_MARGIN,
        width: UI_CONT_WIDTH-3*SPRITES_SIZE-UI_CONTENT_MARGIN,
        pos: UI_CONT_TOP_LEFT.add(UI_CONTENT_MARGIN, 8*UI_CONTENT_MARGIN),
    });
    drawSprite(nextGoal.sprite, {
        height: SPRITES_SIZE,
        pos: UI_CONT_TOP_LEFT.add(
            UI_CONT_WIDTH-SPRITES_SIZE-UI_CONTENT_MARGIN,
            9*UI_CONTENT_MARGIN
        ),
        origin: 'botright'
    });
}

function buildPlaybackCtrl() {
    let btn = add([
        sprite('pause', {
            width: 10,
        }),
        pos(width() - UI_CONT_MARGIN, UI_CONT_MARGIN),
        origin('topright'),
        layer('ui'),
    ]);
    btn.clicks(() => {
        paused = !paused;
        btn.changeSprite(paused ? 'play' : 'pause');
    });
}

// Builds the UI rectangle showing information about the game
function buildUi() {
    playerScore = 0;
    playerNumLives = 3;

    // Display the UI container
    buildContainer();

    let uiData = add([layer("ui")]);
    uiData.on("draw", () => {
        // Display the score
        drawText("Score: " + playerScore, {
            size: UI_CONTENT_MARGIN,
            pos: UI_CONT_TOP_LEFT.add(UI_CONTENT_MARGIN, UI_CONTENT_MARGIN),
        });

        // Display the num of lives
        buildNumOfLives();

        // Display the next goal of the player
        buildNextGoal();
    });

    // Display the playback controller
    buildPlaybackCtrl();
}

