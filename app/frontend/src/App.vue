<template>
  <n-config-provider
      :theme="Theme"
  >
    <!--https://www.naiveui.com/zh-CN/os-theme/components/layout-->
    <n-message-provider container-style="word-break: break-all;">
      <n-notification-provider placement="bottom-right" container-style="text-align: left;">
        <n-loading-bar-provider>
        <n-layout has-sider position="absolute" style="height: 100vh;" :class="headerClass">
          <!--header-->
          <n-layout-header bordered style="height: 42px; bottom: 0; padding: 0; ">
            <Header
                :value="activeItem.label"
                :options="menuOptions"
            />
          </n-layout-header>
          <!--side + content-->
          <n-layout has-sider position="absolute" style="top: 42px; bottom: 0;">
            <n-layout-sider
                bordered
                collapse-mode="width"
                :collapsed-width="60"
                :collapsed="true"
                style="--wails-draggable:drag"
            >
              <Aside
                  :collapsed-width="60"
                  :value="activeItem.label"
                  :options="sideMenuOptions"
              />

            </n-layout-sider>
            <n-layout-content style="padding: 0 16px;">
              <keep-alive>
                <component :is="activeItem.component"></component>
              </keep-alive>

            </n-layout-content>
          </n-layout>
        </n-layout>
        </n-loading-bar-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import {onMounted, shallowRef} from 'vue'
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NMessageProvider
} from 'naive-ui'
import {
  AllOutOutlined,
  GroupsSharp,
  HiveOutlined,
  LibraryBooksOutlined,
  MessageOutlined,
  SendTwotone,
  SettingsOutlined
} from '@vicons/material'
import Header from './components/Header.vue'
import Settings from './components/Settings.vue'
import {GetConfig, SaveTheme} from "../wailsjs/go/config/AppConfig";
import {WindowSetSize} from "../wailsjs/runtime";
import {renderIcon} from "./utils/common";
import Aside from "./components/Aside.vue";
import Conn from "./components/Conn.vue";
import Nodes from "./components/Nodes.vue";
import Topics from "./components/Topics.vue";
import emitter from "./utils/eventBus";
import Groups from "./components/Groups.vue";
import Producer from "./components/Producer.vue";
import Consumer from "./components/Consumer.vue";
import Monitor from "./components/Monitor.vue";

let headerClass = shallowRef('lightTheme')

onMounted(async () => {
  // 从后端加载配置
  const loadedConfig = await GetConfig()
  if (loadedConfig) {
    await WindowSetSize(loadedConfig.width, loadedConfig.height)
    if (loadedConfig.theme === 'light') {
      Theme.value = lightTheme
      headerClass = "lightTheme"
    } else {
      Theme.value = darkTheme
      headerClass = "darkTheme"
    }
  }
  // =====================注册事件监听=====================
  // 主题切换
  emitter.on('update_theme', themeChange)
  // 菜单切换
  emitter.on('menu_select', handleMenuSelect)
})
// 左侧菜单
// 左侧菜单
const sideMenuOptions = [
  {
    label: '集群',
    key: '集群',
    icon: renderIcon(HiveOutlined),
    component: Conn,
  },
  {
    label: '节点',
    key: '节点',
    icon: renderIcon(AllOutOutlined),
    component: Nodes,
  },

  {
    label: '主题',
    key: '主题',
    icon: renderIcon(LibraryBooksOutlined),
    component: Topics,
  },
  {
    label: 'Producer',
    key: 'Producer',
    icon: renderIcon(SendTwotone),
    component: Producer,
  },
  {
    label: 'Consumer',
    key: 'Consumer',
    icon: renderIcon(MessageOutlined),
    component: Consumer,
  },
  {
    label: '消费者组',
    key: '消费者组',
    icon: renderIcon(GroupsSharp),
    component: Groups,
  },
  {
    label: '巡检',
    key: '巡检',
    icon: renderIcon(GroupsSharp),
    component: Monitor,
  },
  {
    label: '设置',
    key: '设置',
    icon: renderIcon(SettingsOutlined),
    component: Settings
  },

]


// 顶部菜单
const menuOptions = []


const activeItem = shallowRef(sideMenuOptions[0])

// 切换菜单
function handleMenuSelect(key) {
  // 根据key寻找item
  activeItem.value = sideMenuOptions.find(item => item.key === key)
}

let Theme = shallowRef(lightTheme)

// 主题切换
function themeChange(newTheme) {
  Theme.value = newTheme
  headerClass = newTheme === lightTheme ? "lightTheme" : "darkTheme"
  SaveTheme(newTheme.name)
}

// 自定义主题
// /**
//  * @type import('naive-ui').GlobalThemeOverrides
//  */
// const themeOverrides = {
//   common: {
//     bodyColor: '#FDFCFF'
//   }
// }

</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;

}

.lightTheme .n-layout-header {
  background-color: #f7f7fa;
}

.lightTheme .n-layout-sider {
  background-color: #f7f7fa !important;
}
</style>