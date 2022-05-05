/// <reference types="../CTAutocomplete-2.0.4" />
/// <reference lib="es2015" />

import RenderLib from "../RenderLib/index.js";
import Settings from "./config";

const farmingBlockTypes = ['Cocoa', 'Nether Wart', 'Carrots', 'Pumpkin', 'Sugar Cane', 'Wheat', 'Mushroom', 'Cactus', 'Potatoes', 'Melon']
let blocksToCheck = new Set();
let missingBlocks = new Set();
const cropNotifier = new KeyBind("Toggle Crop Notifier", Keyboard.KEY_NUMPAD9);
let lastTimeToggled = Date.now();


register("command", () => Settings.openGUI()).setName("missingcropnotifier");
register("command", () => Settings.openGUI()).setName("mcn");

if (!Settings.firstRun) {
    ChatLib.chat("§2[Missing Crop Notifier] §6Welcome to MissingCropNotifier!§r"); 
    ChatLib.chat("§2[Missing Crop Notifier] §6Please configure the settings in the MissingCropNotifier GUI. (/missingcropnotifier)§r");
    ChatLib.chat("§2[Missing Crop Notifier] §6You can also use the command /mcn to open the GUI.§r");
    Settings.firstRun = true;
    Settings.save();
}

register('blockBreak', (block, player, event) => {
    if (farmingBlockTypes.includes(block.type.getName())) {
        let pos = block.pos
        let time = Date.now()
        blocksToCheck.add([pos.x, pos.y, pos.z, time, block.type.getName()]);
    }
});

register('step', () => {
    if (cropNotifier.isPressed()) {
        if (Date.now() - lastTimeToggled > 1000) {
            (Settings.enabled) ? Settings.enabled = false : Settings.enabled = true;
            (Settings.enabled) ? ChatLib.chat("Crop Notifier Enabled") : ChatLib.chat("Crop Notifier Disabled");
            Settings.save();
        }
    }
    if (Settings.enabled) {
        blocksToCheck.forEach((block) => {
            let time = Date.now()
            if (time - block[3] > Settings.delayUntilCheck * 1000) {
                let blockInWorld = World.getBlockAt(block[0], block[1], block[2]);
                if (blockInWorld.type.getName() !== block[4]) {
                    missingBlocks.add([block[0], block[1], block[2], block[4]]);
                    ChatLib.chat(`§4Block was not replanted!§r`);
                    World.playSound("ambient.weather.thunder", 2, 1);
                }
                blocksToCheck.delete(block);
            }
        });
        missingBlocks.forEach((block) => {
            let blockInWorld = World.getBlockAt(block[0], block[1], block[2]);
            if (blockInWorld.type.getName() === block[3]) {
                missingBlocks.delete(block);
            }
        });
    } else {
        blocksToCheck.clear();
        missingBlocks.clear();
    }
}).setFps(3);

register("renderWorld", () => {
    missingBlocks.forEach((block) => {
        RenderLib.drawEspBox(block[0]+0.5, block[1], block[2]+0.5, 1, 1, 1, 0, 0, 1, true);
    });
});