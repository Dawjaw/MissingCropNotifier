import { @Vigilant, @SliderProperty @SwitchProperty } from 'Vigilance';

@Vigilant("MissingCropNotifier")
class Settings {
    @SliderProperty({
        name: "Missing Crop Check Delay",
        description: "How many seconds after breaking the block to check if the crop has been replanted.",
        category: "General",
        min: 1,
        max: 20
    })
    delayUntilCheck = 3;

    @SwitchProperty({
        name: "firstRun",
        description: "state of the first run",
        category: "General",
        hidden: true
    })
    firstRun = false;

    @SwitchProperty({
        name: "Enabled",
        description: "Enable or Disable the module",
        category: "General",
    })
    enabled = true;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "")
    }
}

export default new Settings();