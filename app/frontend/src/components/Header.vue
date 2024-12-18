<template>
  <n-page-header style="padding: 4px;--wails-draggable:drag">
    <template #avatar>
      <n-avatar :src="logo"/>
    </template>
    <template #title>
      <div style="font-weight: 800">{{app_name}}</div>
    </template>
    <template #subtitle>
      <n-tooltip>
        <template #trigger>
          <n-tag :type=title_tag v-if="subtitle">{{subtitle}}</n-tag>
          <n-p v-else>{{desc}}</n-p>
        </template>
      </n-tooltip>
    </template>
    <template #extra>
      <n-flex justify="flex-end" style="--wails-draggable:no-drag" class="right-section">
        <n-button quaternary :focusable="false" @click="changeTheme" :render-icon="renderIcon(MoonOrSunnyOutline)"/>
        <n-button quaternary @click="openUrl(update_url)"
                  :render-icon="renderIcon(CodeFilled)"/>
        <n-tooltip placement="bottom" trigger="hover">
          <template #trigger>
            <n-button quaternary :focusable="false" :loading="update_loading" @click="checkForUpdates"
                      :render-icon="renderIcon(SystemUpdateAltSharp)"/>
          </template>
          <span> 检查版本：{{ version.tag_name }} {{ check_msg }}</span>
        </n-tooltip>
        <n-button quaternary :focusable="false" @click="minimizeWindow" :render-icon="renderIcon(RemoveOutlined)"/>
        <n-button quaternary :focusable="false" @click="resizeWindow" :render-icon="renderIcon(MaxMinIcon)"/>
        <n-button quaternary style="font-size: 22px" :focusable="false" @click="closeWindow">
          <n-icon>
            <CloseFilled/>
          </n-icon>
        </n-button>
      </n-flex>
    </template>
  </n-page-header>
</template>

<script setup>
import {darkTheme, lightTheme, NAvatar, NButton, NFlex, useMessage, useNotification} from 'naive-ui'
import {
  CloseFilled,
  CodeFilled,
  ContentCopyFilled,
  CropSquareFilled,
  NightlightRoundFilled,
  RemoveOutlined,
  SystemUpdateAltSharp,
  WbSunnyOutlined
} from '@vicons/material'
import logo from '../assets/images/appicon.png'
import {h, onMounted, ref, shallowRef} from "vue";
import {BrowserOpenURL, Quit, WindowMaximise, WindowMinimise, WindowUnmaximise} from "../../wailsjs/runtime";
import {CheckUpdate} from '../../wailsjs/go/system/Update'
import {openUrl, renderIcon} from "../utils/common";
import {GetAppName, GetConfig, GetVersion} from "../../wailsjs/go/config/AppConfig";
import emitter from "../utils/eventBus";

defineProps(['options', 'value']);

const MoonOrSunnyOutline = shallowRef(WbSunnyOutlined)
const isMaximized = ref(false);
const check_msg = ref("");
const app_name = ref("");
const title_tag = ref("success");
const MaxMinIcon = shallowRef(CropSquareFilled)
const update_url = "https://github.com/Bronya0/Kafka-King/releases"
const update_loading = ref(false)
let theme = lightTheme

let version = ref({
  tag_name: "",
  body: "",
})

const desc = "更人性化的 Kafka GUI "
const subtitle = ref("")

const notification = useNotification()
const message = useMessage()

onMounted(async () => {
  emitter.on('selectNode', selectNode)
  // emitter.on('changeTitleType', changeTitleType)

  app_name.value = await GetAppName()

  const config = await GetConfig()
  MoonOrSunnyOutline.value = config.theme === lightTheme.name ? WbSunnyOutlined : NightlightRoundFilled
  const v = await GetVersion()
  version.value.tag_name = v
  subtitle.value = desc + v
  await checkForUpdates()
})

const selectNode = (node) => {
  subtitle.value = "当前集群：【" + node.name + "】"
}

const checkForUpdates = async () => {
  update_loading.value = true
  try {
    const v = await GetVersion()
    const resp = await CheckUpdate()
    if (!resp) {
      check_msg.value = "无法连接github，请检查网络"
    } else if (resp.tag_name !== v) {
      check_msg.value = '发现新版本 ' + resp.tag_name
      version.value.body = resp.body
      const n = notification.success({
        title: '发现新版本 ' + resp.tag_name,
        content: resp.body,
        action: () =>
              h(NFlex, {justify: "flex-end" }, () => [
                h(
                    NButton,
                    {
                      type: 'primary',
                      secondary: true,
                      onClick: () => BrowserOpenURL(update_url),
                    },
                    () => "立即下载",
                ),
                h(
                    NButton,
                    {
                      secondary: true,
                      onClick: () => {
                        n.destroy()
                      },
                    },
                    () => "取消",
                ),
            ]),
        onPositiveClick: () => BrowserOpenURL(update_url),
      })
    }
  } finally {
    update_loading.value = false
  }
}

const minimizeWindow = () => {
  WindowMinimise()
}

const resizeWindow = () => {
  isMaximized.value = !isMaximized.value;
  if (isMaximized.value) {
    WindowMaximise();
    MaxMinIcon.value = ContentCopyFilled;
  } else {
    WindowUnmaximise();
    MaxMinIcon.value = CropSquareFilled;
  }
  console.log(isMaximized.value)

}

const closeWindow = () => {
  Quit()
}
const changeTheme = () => {
  MoonOrSunnyOutline.value = MoonOrSunnyOutline.value === NightlightRoundFilled ? WbSunnyOutlined : NightlightRoundFilled;
  theme = MoonOrSunnyOutline.value === NightlightRoundFilled ? darkTheme : lightTheme
  emitter.emit('update_theme', theme)
}
</script>

<style scoped>


.right-section .n-button {
  padding: 0 8px;
}
</style>