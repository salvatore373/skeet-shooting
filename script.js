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

const CLEAR_COLOR = [0.6, 0.8, 1, 1];
kaboom({
    global: true,
    scale: 2,
    fullscreen: true,
    debug: true,
    clearColor: CLEAR_COLOR,
});

const MAIN_SCENE_ID = 'main';

const HEAD_TEXT_SIZE = height() / 10;
const SMALL_TEXT_SIZE = height() / 24;
const MEDIUM_TEXT_SIZE = height() / 20;
const BIG_TEXT_SIZE = height() / 14;
const MARGIN_SIZE = 10;
const BTN_WIDTH = width() / 6;
const BTN_HEIGHT = HEAD_TEXT_SIZE;
const BTN_WIDTH_HOVER = BTN_WIDTH + BTN_WIDTH*0.2;
const BTN_HEIGHT_HOVER = BTN_HEIGHT + BTN_HEIGHT*0.2;
const BTN_BORDER = 7;
const BTN_TEXT = MEDIUM_TEXT_SIZE;
const BTN_TEXT_HOVER = BTN_TEXT + BTN_TEXT*0.2;

const CONTENT_TOP_CENTER = vec2(width() / 2, height() / 4);
const PLAY_RECT_CENTER = CONTENT_TOP_CENTER.add(0, HEAD_TEXT_SIZE + MARGIN_SIZE + BTN_HEIGHT_HOVER/2);

// Displays a button with the given text, that triggers onClick when clicked or when assocKey
// is pressed, and whose center is in centerPosition.
function buildButton(text, centerPosition, assocKey, onClick) {
    // Display the play button
    let rectExt = add([
        rect(BTN_WIDTH, BTN_HEIGHT),
        pos(centerPosition),
        origin('center'),
    ]);
    let rectInt = add([
        rect(BTN_WIDTH - BTN_BORDER, BTN_HEIGHT - BTN_BORDER),
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
            rectExt.width = BTN_WIDTH_HOVER;
            rectExt.height = BTN_HEIGHT_HOVER;
            rectInt.width = BTN_WIDTH_HOVER - BTN_BORDER;
            rectInt.height = BTN_HEIGHT_HOVER - BTN_BORDER;
        } else {
            rectExt.width = BTN_WIDTH;
            rectExt.height = BTN_HEIGHT;
            rectInt.width = BTN_WIDTH - BTN_BORDER;
            rectInt.height = BTN_HEIGHT - BTN_BORDER;
        }
    });
    rectExt.clicks(onClick);
    keyPress(assocKey, onClick);
}

function main() {
    add([
        text('Skeet Shooting', HEAD_TEXT_SIZE),
        pos(CONTENT_TOP_CENTER),
        origin('top'),
    ]);

    // Display the play button
    buildButton('PLAY', PLAY_RECT_CENTER, 'p', () => {
        go('game');
    });

    add([
        text("Press 'p' to play", SMALL_TEXT_SIZE),
        pos(width()/2, height() - MARGIN_SIZE),
        origin('bot')
    ]);
}

scene(MAIN_SCENE_ID, main);
go(MAIN_SCENE_ID);