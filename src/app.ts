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

    // Fancy button (Red)
    const fancybutton: NamedContainer = {
      name: 'FancyButton',
      container: new FancyButton({
        defaultView: new Sprite(
          renderer.generateTexture(new Graphics().beginFill(0xff0000) .drawRect(0,0,width/4,height/4).endFill())
        )
      })
    };;
    // This signal will properly evoke if the button is clicked.
    (fancybutton.container as FancyButton).onPress.connect(() => console.log(`${fancybutton.name} has been pressed`));
    bindListeners(fancybutton);

    // Child element (Green) of the FancyButton aren't overshadowed.
    const graphics_child:NamedContainer = {
      name: 'Graphics_child',
      container: new Graphics().beginFill(0x00ff00).drawRect(0,0,width/8,height/8).endFill()
    };
    graphics_child.container.eventMode = 'static';
    bindListeners(graphics_child);
    fancybutton.container.addChild(graphics_child.container);

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
    switcher.container.x = 300;

    // Adding graphics (Blue) to stage.
    stage.addChild(graphics.container);

    // Adding fancybutton (red) to stage
    /**
     * If the FancyButton is rendered it will, for some reason, 
     * encapsulate the DOM and steal all the 'pointermove' events
     * such that no other containers can propogate them.
     * 
     * It will fire a 'pointerout' event when the cursor leaves the stage,
     * however it will immediately fire a 'pointerover' event at that boundary
     */
    // stage.addChild(fancybutton.container); // Uncomment me!

    /**
     * The Switcher doesn't ensnare move events, but the hover event is only
     * fired if the pointer enters its container from outside the DOM. It will
     * immediately fire the 'pointerout' event, and cannot be initiated from
     * within the DOM.
     */
    stage.addChild(switcher.container); // Uncomment me!
  }
}