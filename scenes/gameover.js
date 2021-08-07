/*
 * "Skeet Shooting": A retro-style skeet shooting game
 * Copyright (C) 2021  Salvatore Michele Rago
 *
 * This file is part of Skeet Shooting
 *
 * Nome-Programma is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nome-Programma is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Nome-Programma.  If not, see <http://www.gnu.org/licenses/>.
 */

const HEAD_TEXT_SIZE = height() / 10;
const SMALL_TEXT_SIZE = height() / 24;
const MEDIUM_TEXT_SIZE = height() / 20;
const BIG_TEXT_SIZE = height() / 14;
const MARGIN_SIZE = 10;

const TOP_CENTER = vec2(width() / 2, height() / 4);

loadSound('jingle', './sounds/jingle.mp3');

function getGoalData(score) {
    if (score > WORLD_REC_SCORE) {
        return new GoalData(WORLD_REC_SCORE, 'WORLD RECORD', 'world_rec');
    } else if (score > OLYMP_REC_SCORE) {
        return new GoalData(OLYMP_REC_SCORE, 'OLYMPIC RECORD', 'oly_rec');
    } else if (score > GOLD_SCORE) {
        return new GoalData(GOLD_SCORE, 'GOLD MEDAL', 'gold_medal');
    } else if (score > SILVER_SCORE) {
        return new GoalData(SILVER_SCORE, 'SILVER MEDAL', 'silver_medal');
    } else if (score > BRONZE_SCORE) {
        return new GoalData(BRONZE_SCORE, 'BRONZE MEDAL', 'bronze_medal');
    } else {
        return null;
    }
}

function buildGameOver(score) {
    // Display The background
    add([
        rect(width(), height()),
        color(0.6, 0.8, 1),
    ]);

    add([
        text('Game Over', height() / 10),
        pos(TOP_CENTER),
        origin('top'),
    ]);

    add([
        text('Score: ' + score, height() / 14),
        pos(TOP_CENTER.add(0, HEAD_TEXT_SIZE + MARGIN_SIZE)),
        origin('top'),
    ]);

    let goalData = getGoalData(score);
    console.log(score);
    if (goalData) {
        add([
            text('You achieved: ' + goalData.eventName.toUpperCase(), MEDIUM_TEXT_SIZE),
            pos(TOP_CENTER.add(0, HEAD_TEXT_SIZE + MARGIN_SIZE + BIG_TEXT_SIZE + MARGIN_SIZE)),
            origin('top'),
        ]);
    }

    add([
        text('Press the space bar to play again'),
        origin('bot'),
        pos(width()/2, height()-MARGIN_SIZE),
    ]);
    keyPress('space', () => {
        go('main');
    });

    play('jingle');
}

scene('game_over', buildGameOver);