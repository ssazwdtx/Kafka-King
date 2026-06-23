/*
 * Copyright 2025 Bronya0 <tangssst@163.com>.
 * Author Github: https://github.com/Bronya0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eventBus.js
import mitt from 'mitt'

const emitter = mitt()

// 全局当前连接名，所有组件通过此共享
let _currentConnectName = ''
export function setConnectName(name) {
  console.log('[setConnectName]', name)
  _currentConnectName = name
}
export function getConnectName() { return _currentConnectName }

export default emitter