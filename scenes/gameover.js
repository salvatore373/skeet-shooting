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

const GAME_OVER_SCENE_ID = 'game_over';

loadSound('jingle', './sounds/jingle.mp3');


function buildBigButton(text, centerPosition, assocKey, onClick)
{
    // Display the play button
    let rectExt = add([
        rect(2 * BTN_WIDTH, BTN_HEIGHT),
        pos(centerPosition),
        origin('center'),
    ]);
    let rectInt = add([
        rect(2 * BTN_WIDTH - BTN_BORDER, BTN_HEIGHT - BTN_BORDER),
        pos(centerPosition),
        origin('center'),
        color(...CLEAR_COLOR)
    ]);
    let rectText = add([
    ]);
    rectText.on('draw', () => {
        drawText(text, {
            size: rectExt.isHovered() ? BTN_TEXT_HOVER : BTN_TEXT,
            pos: centerPosition,
            origin: 'center',
        });
    });
    rectExt.action(() => {
        if(rectExt.isHovered()) {
            rectExt.width = 2 * BTN_WIDTH_HOVER;
            rectExt.height = BTN_HEIGHT_HOVER;
            rectInt.width = 2 * BTN_WIDTH_HOVER - BTN_BORDER;
            rectInt.height = BTN_HEIGHT_HOVER - BTN_BORDER;
        } else {
            rectExt.width = 2 * BTN_WIDTH;
            rectExt.height = BTN_HEIGHT;
            rectInt.width = 2 * BTN_WIDTH - BTN_BORDER;
            rectInt.height = BTN_HEIGHT - BTN_BORDER;
        }
    });
    rectExt.clicks(onClick);
    keyPress(assocKey, onClick);
}

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
    add([
        text('Game Over', height() / 10),
        pos(CONTENT_TOP_CENTER),
        origin('top'),
    ]);

    add([
        text('Score: ' + score, height() / 14),
        pos(CONTENT_TOP_CENTER.add(0, HEAD_TEXT_SIZE + MARGIN_SIZE)),
        origin('top'),
    ]);

    let goalData = getGoalData(score);
    if (goalData) {
        add([
            text('You achieved: ' + goalData.eventName.toUpperCase(), MEDIUM_TEXT_SIZE),
            pos(CONTENT_TOP_CENTER.add(0, HEAD_TEXT_SIZE + MARGIN_SIZE + BIG_TEXT_SIZE + MARGIN_SIZE)),
            origin('top'),
        ]);
    }

    buildBigButton(
        'PLAY AGAIN',
        vec2(width()/2, height() - SMALL_TEXT_SIZE - 4*MARGIN_SIZE),
        'space',
        () => {
            go(GAME_SCENE_ID);
        },
        true,
    )
    add([
        text('Press the space bar to play again', SMALL_TEXT_SIZE),
        origin('bot'),
        pos(width()/2, height()-MARGIN_SIZE),
    ]);

    if(!muted) play('jingle');
}

scene(GAME_OVER_SCENE_ID, buildGameOver);