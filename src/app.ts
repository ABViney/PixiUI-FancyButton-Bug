import { Application, Container, FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { Button, FancyButton, Switcher } from "../Pixi-UI";

export class App {

  constructor(app: Application) {
    const {stage, renderer, view} = app;
    const {width, height} = view;

    stage.eventMode = 'static';

    type NamedContainer = {
      name:string;
      container:Container;
    }

    const bindListeners = (obj: NamedContainer) => {
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

    // Opaque (Blue) square to recieve events
    const graphics:NamedContainer = {
      name: 'Graphics',
      container: new Graphics().beginFill(0xff0).drawRect(0,0,width/2,height/2).endFill()
    };
    graphics.container.eventMode = 'static';
    bindListeners(graphics);

    // Switcher (Red/Green)
    const switcher: NamedContainer = {
      name: 'Switcher',
      container: new Switcher(
        [new Graphics().beginFill(0x00ff00).drawRect(0,0,width/8,height/8).endFill(),
        new Graphics().beginFill(0xff0000).drawRect(0,0,width/8,height/8).endFill()],
        'onHover' // The Switcher will change to the next state when 'pointerover' fires
      )
    };
    bindListeners(switcher);
    switcher.container.x = view.width - switcher.container.width;
    console.log(view, stage)

    // Adding graphics (Blue) to stage.
    stage.addChild(graphics.container);

    /**
     * The Switcher object's 'onHover' signal can be triggered by having its container be in the 
     * first intersection between the pointer and the stage.
     */
    stage.addChild(switcher.container); // Uncomment me!
  }
}