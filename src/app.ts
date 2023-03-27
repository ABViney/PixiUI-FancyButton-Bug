import { Application, Container, FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { Button, FancyButton, Switcher } from "../ui/src";

    type NamedContainer = {
      name:string;
      container:Container;
    }
export class App {

  constructor(app: Application) {
    const {stage, view} = app;
    const {width, height} = view;

    const graphics:NamedContainer = {
      name: 'Graphics',
      container: new Graphics().beginFill(0xff0).drawRect(0,0,width/2,height/2).endFill()
    };
    graphics.container.eventMode = 'static';
    this.bindListeners(graphics);

    // Adding graphics (Blue) to stage.
    stage.addChild(graphics.container);



    // Switcher (Red/Green)
    const switcher_obj = new Switcher(
      [new Graphics().beginFill(0x00ff00).drawRect(0,0,width/8,height/8).endFill(),
      new Graphics().beginFill(0xff0000).drawRect(0,0,width/8,height/8).endFill()],
      'onHover' // The Switcher will change to the next state when 'pointerover' fires on its innerView
    );
    switcher_obj.eventMode = 'static';
    // This is ~supposed~ to move the switcher to the right side of the stage.
    switcher_obj.x = view.width - switcher_obj.width;

    const switcher: NamedContainer = {
      name: 'Switcher',

      container: switcher_obj
      // container: switcher_obj.innerView
    };
    this.bindListeners(switcher);    

    stage.addChild(switcher_obj); // Uncomment me!
  }

  public bindListeners(obj: NamedContainer) {
    // If the pointer enters over an object it will announce the object's assigned name
    // and will not do so again until it has left the object.
    const overCallback = () => {
      // Log entry, remove listener
      console.log(`Mousing over ${obj.name}`);
      obj.container.off('pointerover', overCallback);

      // These variables act to buffer console logging to prevent flooding
      let last_logged:number = 1000;
      let now = Date.now();

      // While the mouse is actively moving over an object it will
      // log the object being hovered over once every second
      const moveCallback = () => {
        if ( last_logged >= 1000 ) {
          last_logged = 0;
          console.log(`Pointer moving over ${obj.name}`);
        }
        const new_now = Date.now();
        last_logged += new_now - now;
        now = new_now;
      };

      // Once the mouse leaves the container, it will anounce the name of the container
      // before removing all listeners, then rebinding the 'pointerover' listener.
      const outCallback = () => {
        console.log(`Pointer leaving ${obj.name}`);
        obj.container.off('pointermove', moveCallback);
        obj.container.off('pointerout', outCallback);
        obj.container.on('pointerover', overCallback);
      };

      // Attach listeners
      obj.container.on('pointermove', moveCallback);
      obj.container.on('pointerout', outCallback);
    };

    obj.container.on('pointerover', overCallback);
  };
}