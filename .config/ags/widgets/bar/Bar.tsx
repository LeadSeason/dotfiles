import app from "ags/gtk4/app"
import GLib from "gi://GLib"
import Astal from "gi://Astal?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import { createPoll } from "ags/time"
import { createBinding, createState, For, With } from "ags"
import AstalTray from "gi://AstalTray"
import AstalWp from "gi://AstalWp?version=0.1"

import SwayWs from "./widgets/sway";
import Notify from "./widgets/Notify";
import PowerMenu from "./widgets/powermenu";
import Brightness from "../../lib/brightness"
import AstalBattery from "gi://AstalBattery?version=0.1"
import { secondsToTime } from "../../tools/utils"
import { set } from "../../../../../../../usr/share/ags/js/gnim/src/util"
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1"

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
          speaker.volume += arg1 / 100
          return true
        }}
      />
      <box spacing={6}>
        <label label={createBinding(speaker, "volume").as((v) => (v * 100).toFixed(0) + "%")} />
        <image iconName={createBinding(speaker, "volumeIcon")} />
      </box>
      <popover>
        <box>
          <slider
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

function BatteryLevel() {
  const bat = AstalBattery.get_default()
  const powerProfiles = AstalPowerProfiles.get_default()

  const [batTime, setBatTime] = createState(secondsToTime(
        (bat.charging) ? bat.timeToEmpty : bat.timeToEmpty))

  createBinding(bat, "timeToEmpty").subscribe(() => {
    if (!bat.get_charging()) {
      setBatTime(secondsToTime(bat.timeToEmpty))
    }})

  createBinding(bat, "timeToFull").subscribe(() => {
    if (bat.get_charging()) {
      setBatTime(secondsToTime(bat.timeToFull))
    }})

  return <menubutton>
    <box visible={createBinding(bat, "isPresent")}>
      <label label={createBinding(bat, "percentage").as((v) => `${Math.floor(v * 100)}%`)} />
      <image iconName={createBinding(bat, "iconName")} />
    </box>
    <box visible={createBinding(bat, "isPresent").as((v) => !v)}>
      <image iconName={createBinding(powerProfiles, "activeProfile").as(v => `power-profile-${v}-symbolic`)} />
    </box>
    <popover>
      <box spacing={5} orientation={Gtk.Orientation.VERTICAL} class="battery-popover">
        <label visible={createBinding(bat, "isPresent")} label={batTime.as((v) => {
          if (v === "00:00:00") {
            v = "Unknown time remaining"
          }
          if (bat.charging) {
            v = "Charging... Time to full: " + v
          } else {
            v = "Discharging... Time to empty: " + v
          }
          return v
        })} />
        <box spacing={5}>
          {powerProfiles.get_profiles().map((profile) => {
            console.log(profile.profile)
            return <button
              onClicked={() => {
                powerProfiles.set_active_profile(profile.profile)
              }}
              class={createBinding(powerProfiles, "activeProfile").as(active =>
                (active === profile.profile) ? "active" : "")}
              >
                <image iconName={`power-profile-${profile.profile}-symbolic`} />
                <label label={profile.profile} css={createBinding(powerProfiles, "activeProfile").as(active => (active == profile.profile) ? "font-weight: bold;" : "")}/>
              </button>
            })}
        </box>
      </box>
    </popover>
  </menubutton>
}

function DisplayBrightness() {
  const brightness = Brightness.get_default()
  const icons = [ '󰃛', '󰃜', '󰃞', '󰃟', '󰃝', '󰃠' ]
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
          microphone.volume += arg1 / 150
          return true
        }}
      />
      <box spacing={6}>
        <label label={createBinding(microphone, "volume").as((v) => (v * 100).toFixed(0) + "%")} />
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
          <BatteryLevel />
          <AudioInput />
          <AudioOutput />
          {/* <PowerMenu /> */}
          <Notify />
        </box>
      </centerbox>
    </window>
  )
}