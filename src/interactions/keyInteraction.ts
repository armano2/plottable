///<reference path="../reference.ts" />

module Plottable {
export type KeyCallback = (keyCode: number) => void;

export module Interactions {
  export class Key extends Interaction {
    /**
     * A Key Interaction listens to key events that occur while the Component is
     * moused over.
     */
    private _positionDispatcher: Plottable.Dispatchers.Mouse;
    private _keyDispatcher: Plottable.Dispatchers.Key;
    private _keydownKeyCodeCallbacks: { [keyCode: string]: Utils.CallbackSet<KeyCallback> } = {};
    private _keyupKeyCodeCallbacks: { [keyCode: string]: Utils.CallbackSet<KeyCallback> } = {};

    private _mouseMoveCallback = (point: Point) => false; // HACKHACK: registering a listener
    private _keyDownCallback = (keyCode: number) => this._handleKeyDownEvent(keyCode);
    private _keyUpCallback = (keyCode: number) => this._handleKeyUpEvent(keyCode);

    protected _anchor(component: Component) {
      super._anchor(component);
      this._positionDispatcher = Dispatchers.Mouse.getDispatcher(
                                   <SVGElement> (<any> this._componentAttachedTo)._element.node()
                                 );
      this._positionDispatcher.onMouseMove(this._mouseMoveCallback);

      this._keyDispatcher = Dispatchers.Key.getDispatcher();
      this._keyDispatcher.onKeyDown(this._keyDownCallback);
      this._keyDispatcher.onKeyUp(this._keyUpCallback);
    }

    protected _unanchor() {
      super._unanchor();
      this._positionDispatcher.offMouseMove(this._mouseMoveCallback);
      this._positionDispatcher = null;

      this._keyDispatcher.offKeyDown(this._keyDownCallback);
      this._keyDispatcher.offKeyUp(this._keyUpCallback);
      this._keyDispatcher = null;
    }

    private _handleKeyDownEvent(keyCode: number) {
      var p = this._translateToComponentSpace(this._positionDispatcher.lastMousePosition());
      if (this._isInsideComponent(p) && this._keydownKeyCodeCallbacks[keyCode]) {
        this._keydownKeyCodeCallbacks[keyCode].callCallbacks(keyCode);
      }
    }

    private _handleKeyUpEvent(keyCode: number) {
      var p = this._translateToComponentSpace(this._positionDispatcher.lastMousePosition());
      if (this._isInsideComponent(p) && this._keyupKeyCodeCallbacks[keyCode]) {
        this._keyupKeyCodeCallbacks[keyCode].callCallbacks(keyCode);
      }
    }

    /**
     * Adds a callback to be called when the key with the given keyCode is
     * pressed and the user is moused over the Component.
     *
     * @param {number} keyCode
     * @param {KeyCallback} callback
     * @returns {Interactions.Key} The calling Key Interaction.
     */
    public onKeyPress(keyCode: number, callback: KeyCallback) {
      if (!this._keydownKeyCodeCallbacks[keyCode]) {
        this._keydownKeyCodeCallbacks[keyCode] = new Utils.CallbackSet<KeyCallback>();
      }
      this._keydownKeyCodeCallbacks[keyCode].add(callback);
      return this;
    }

    /**
     * Removes a callback that would be called when the key with the given keyCode is
     * pressed and the user is moused over the Component.
     *
     * @param {number} keyCode
     * @param {KeyCallback} callback
     * @returns {Interactions.Key} The calling Key Interaction.
     */
    public offKeyPress(keyCode: number, callback: KeyCallback) {
      this._keydownKeyCodeCallbacks[keyCode].delete(callback);
      if (this._keydownKeyCodeCallbacks[keyCode].size === 0) {
        delete this._keydownKeyCodeCallbacks[keyCode];
      }
      return this;
    }

    /**
     * Adds a callback to be called when the key with the given keyCode is
     * released and the user is moused over the Component.
     *
     * @param {number} keyCode
     * @param {KeyCallback} callback
     * @returns {Interactions.Key} The calling Key Interaction.
     */
    public onKeyRelease(keyCode: number, callback: KeyCallback) {
      if (!this._keyupKeyCodeCallbacks[keyCode]) {
        this._keyupKeyCodeCallbacks[keyCode] = new Utils.CallbackSet<KeyCallback>();
      }
      this._keyupKeyCodeCallbacks[keyCode].add(callback);
      return this;
    }

    /**
     * Removes a callback that would be called when the key with the given keyCode is
     * released and the user is moused over the Component.
     *
     * @param {number} keyCode
     * @param {KeyCallback} callback
     * @returns {Interactions.Key} The calling Key Interaction.
     */
    public offKeyRelease(keyCode: number, callback: KeyCallback) {
      this._keyupKeyCodeCallbacks[keyCode].delete(callback);
      if (this._keyupKeyCodeCallbacks[keyCode].size === 0) {
        delete this._keyupKeyCodeCallbacks[keyCode];
      }
      return this;
    }
  }
}
}
