import Astal from "gi://Astal?version=4.0"
import GLib from "gi://GLib"
import Gdk from "gi://Gdk?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import app from "ags/gtk4/app"
import { createBinding, For } from "ags"
import { createPoll } from "ags/time"
import AstalTray from "gi://AstalTray"
import AstalWp from "gi://AstalWp?version=0.1"

import Brightness from "../../lib/brightness"

import Battery from "./widgets/battery";
import Notify from "./widgets/notify";
import SwayWs from "./widgets/sway";

/**
 * @TODO Bar.tsx
 * Add mouse click functionality to AudioOutput and AudioInput
 * 
 */

function Tray() {
  const tray = AstalTray.get_default()
  const items = createBinding(tray, "items")

  const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
    btn.menuModel = item.menuModel
    btn.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      btn.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <box class="tray">
      <For each={items}>
        {(item) => (
          <menubutton $={(self) => init(self, item)}>
            <image gicon={createBinding(item, "gicon")} />
          </menubutton>
        )}
      </For>
    </box>
  )
}

function OSIcon() {
  return <button>
    <label label="" />
  </button>
}

function Clock({ format = "%H:%M" }) {
  const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format(format)!
  })

  return (
    <menubutton>
      <label label={time} />
      <popover>
        <Gtk.Calendar />
      </popover>
    </menubutton>
  )
}

function DisplayBrightness() {
  const brightness = Brightness.get_default()
  const icons = ['󰃛', '󰃜', '󰃞', '󰃟', '󰃝', '󰃠']
  return <box
    visible={createBinding(brightness, "isPresent")}
  >
    <Gtk.EventControllerScroll
      flags={Gtk.EventControllerScrollFlags.VERTICAL}
      onScroll={(
        source: Gtk.EventControllerScroll,
        arg0: number,
        arg1: number
      ) => {
        brightness.screen += arg1 / 150
        return true
      }} />
    <label label={createBinding(brightness, "screen").as((v) =>
      `${Math.floor(v * 100)}% ${icons[Math.floor(v * 6)]}`
    )} />
  </box>
}

function AudioOutput() {
  const { defaultSpeaker: speaker } = AstalWp.get_default()!
  const wp = AstalWp.get_default()

  return (
    <menubutton
    >
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={(
          source: Gtk.EventControllerScroll,
          arg0: number,
          arg1: number
        ) => {
          speaker.volume -= arg1 / 100
          return true
        }}
      />
      <Gtk.GestureClick
        button={3}
        onPressed={() => {
          speaker.mute = !speaker.mute
          return true
        }}
      />
      <box spacing={6}>
        <label
          class={createBinding(speaker, "mute").as((v) => v ? "muted" : "")}
          label={createBinding(speaker, "volume").as((v) => (v * 100).toFixed(0) + "%")}
        />
        <image iconName={createBinding(speaker, "volumeIcon")} />
      </box>
      <popover>
        <box>
          <slider
            max={1.5}
            widthRequest={260}
            onChangeValue={({ value }) => speaker.set_volume(value)}
            value={createBinding(speaker, "volume")}
          />
        </box>
          
        {/** 
         * List All devices
         * Have a button to change the default speaker.
         * 
         * List All sources
         * button to mute a source
         * 
         * If possible show to current level of the source
         *
         */}
      </popover>
    </menubutton>
  )
}

function AudioInput() {
  const { defaultMicrophone: microphone } = AstalWp.get_default()!
  const wp = AstalWp.get_default()

  return (
    <menubutton
    >
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={(
          source: Gtk.EventControllerScroll,
          arg0: number,
          arg1: number
        ) => {
          microphone.volume -= arg1 / 150
          return true
        }}
      />
      <Gtk.GestureClick
        button={3}
        onPressed={() => {
          microphone.mute = !microphone.mute
          return true
        }}
      />
      <box spacing={6}>
        <label
          class={createBinding(microphone, "mute").as((v) => v ? "muted" : "")}
          label={createBinding(microphone, "volume").as((v) => (v * 100).toFixed(0) + "%")}
        />
        <image iconName={createBinding(microphone, "volumeIcon")} />
      </box>
      <popover>
        <box>
          <slider
            widthRequest={260}
            onChangeValue={({ value }) => microphone.set_volume(value)}
            value={createBinding(microphone, "volume")}
          />
        </box>
      </popover>
    </menubutton>
  )
}

export default function Bar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="AstalBar"
      namespace={"AstalBar"}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <box $type="start">
          <OSIcon />
          <SwayWs monitor={gdkmonitor} />
        </box>
        <box $type="center">
          <Clock />
        </box>
        <box $type="end">
          <Tray />
          <DisplayBrightness />
          <Battery />
          <AudioInput />
          <AudioOutput />
          <Notify />
        </box>
      </centerbox>
    </window>
  )
}