<template>
  <div @mouseenter="onEnter" @mouseleave="onLeave" class="h-dvh">
    <Drawer
      :expanded="true"
      position="start"
      mode="push"
      :width="effectiveExpanded ? 288 : 80"
      :minimized="false"
      class="bg-[#383e54] text-white h-full border-r border-gray-200 dark:border-neutral-800 transition-[width] duration-200"
      navigation-header="headerTemplate"
      navigation-footer="footerTemplate"
      navigation-content="contentTemplate"
    >
      <template #headerTemplate>
        <div class="h-14 flex items-center px-4 font-semibold tracking-tight">
          <span v-if="effectiveExpanded">My App</span>
          <span v-else class="w-full text-center">MA</span>
        </div>
      </template>

      <template #contentTemplate>
        <nav class="px-2 py-2 space-y-1">
          <div v-for="item in visibleItems" :key="item.id ?? item.to">
            <Tooltip
              v-if="item.to"
              :open-on="effectiveExpanded ? 'none' : 'hover'"
              :position="'right'"
              :anchor-element="'target'"
              :content="item.text"
            >
              <RouterLink
                :to="item.to"
                class="flex items-center rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="[
                  isActive(item.to)
                    ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200',
                  effectiveExpanded
                    ? 'gap-3 justify-start'
                    : 'gap-0 justify-center',
                ]"
              >
                <component
                  :is="iconFor(item.icon)"
                  class="h-5 w-5"
                  aria-hidden="false"
                />
                <span v-if="effectiveExpanded" class="truncate ml-3">{{
                  item.text
                }}</span>
              </RouterLink>
            </Tooltip>

            <div v-else class="rounded-xl">
              <Tooltip
                :open-on="effectiveExpanded ? 'none' : 'hover'"
                :position="'right'"
                :anchor-element="'target'"
                :content="item.text"
              >
                <button
                  type="button"
                  class="w-full flex items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="
                    effectiveExpanded
                      ? 'justify-between gap-3'
                      : 'justify-center gap-0'
                  "
                  @click="openGroups[item.id!] = !openGroups[item.id!]"
                  :aria-expanded="openGroups[item.id!] ? 'true' : 'false'"
                >
                  <component
                    :is="iconFor(item.icon)"
                    class="h-5 w-5"
                    aria-hidden="false"
                  />
                  <span v-if="effectiveExpanded" class="truncate ml-3 flex-1">{{
                    item.text
                  }}</span>
                  <ChevronDownIcon
                    v-if="effectiveExpanded"
                    class="h-4 w-4 transition-transform"
                    :class="openGroups[item.id!] ? 'rotate-180' : ''"
                  />
                </button>
              </Tooltip>

              <div
                v-if="effectiveExpanded"
                class="grid transition-[grid-template-rows] duration-200 overflow-hidden"
                :style="openGroups[item.id!] ? 'grid-template-rows:1fr' : 'grid-template-rows:0fr'"
              >
                <ul class="min-h-0 pl-2">
                  <li v-for="c in item.children" :key="c.to" class="py-0.5">
                    <RouterLink
                      :to="c.to!"
                      class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="
                        isActive(c.to)
                          ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-300'
                      "
                    >
                      <span
                        class="ml-1 w-1.5 h-1.5 rounded-full bg-current opacity-60"
                      ></span>
                      <span class="truncate">{{ c.text }}</span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </template>

      <template #footerTemplate>
        <div
          class="px-3 py-2 border-t border-gray-200 dark:border-neutral-800 flex items-center gap-2"
        >
          <button
            class="k-button k-button-md w-full"
            @click="$emit('update:expanded', !props.expanded)"
          >
            {{ effectiveExpanded ? "Collapse" : "Expand" }}
          </button>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Kendo Drawer + Tooltip
import { Drawer } from "@progress/kendo-vue-layout";
import { Tooltip } from "@progress/kendo-vue-tooltip";
import "@progress/kendo-theme-default/dist/all.css";

// Heroicons (outline)
import {
  HomeIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  InboxIcon,
  CreditCardIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

interface NavNode {
  text: string;
  to?: string;
  icon?: string;
  perm?: string;
  id?: string;
  children?: NavNode[];
}

const props = withDefaults(
  defineProps<{ items: NavNode[]; expanded?: boolean }>(),
  { expanded: true }
);
const emit = defineEmits<{ "update:expanded": [boolean] }>();

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const openGroups = ref<Record<string, boolean>>({});

const visibleItems = computed(() => filterByPermission(props.items, auth.can));

function filterByPermission(
  nodes: NavNode[],
  can: (p: string) => boolean
): NavNode[] {
  return nodes
    .filter((n) => !n.perm || can(n.perm))
    .map((n) =>
      n.children ? { ...n, children: filterByPermission(n.children, can) } : n
    )
    .filter((n) => n.to || (n.children && n.children.length));
}

const isActive = (to?: string) =>
  !!to && (route.path === to || route.matched.some((m) => m.path === to));

function iconFor(name?: string) {
  switch (name) {
    case "home":
      return HomeIcon;
    case "inbox":
      return InboxIcon;
    case "shopping-bag":
      return ShoppingBagIcon;
    case "shopping-cart":
      return ShoppingCartIcon;
    case "credit-card":
      return CreditCardIcon;
    case "chart-bar":
      return ChartBarIcon;
    case "document-chart-bar":
      return DocumentChartBarIcon;
    case "cog-6-tooth":
      return Cog6ToothIcon;
    default:
      return HomeIcon;
  }
}

function onSelect(e: any) {
  const item = e.item as NavNode;
  if (item.to) router.push(item.to);
}

// === Hover-to-peek (desktop only) ===
const isDesktop = ref(true);
const peek = ref(false);
let enterT: number | null = null;
let leaveT: number | null = null;

const effectiveExpanded = computed(
  () => props.expanded || (peek.value && isDesktop.value)
);

function onEnter() {
  if (!isDesktop.value || props.expanded) return;
  if (leaveT) {
    clearTimeout(leaveT);
    leaveT = null;
  }
  enterT = window.setTimeout(() => {
    peek.value = true;
  }, 120);
}
function onLeave() {
  if (!isDesktop.value || props.expanded) return;
  if (enterT) {
    clearTimeout(enterT);
    enterT = null;
  }
  leaveT = window.setTimeout(() => {
    peek.value = false;
  }, 180);
}

function updateMQ() {
  isDesktop.value = window.matchMedia("(min-width: 1024px)").matches;
}

onMounted(() => {
  emit("update:expanded", true);
  updateMQ();
  const mq = window.matchMedia("(min-width: 1024px)");
  const handler = () => updateMQ();
  mq.addEventListener?.("change", handler);
  (onBeforeUnmount as any)(() => mq.removeEventListener?.("change", handler));

  setTimeout(() => {
    emit("update:expanded", false);
  }, 1000);
});

onBeforeUnmount(() => {
  if (enterT) clearTimeout(enterT);
  if (leaveT) clearTimeout(leaveT);
});
</script>

<style scoped>
:deep(.k-drawer) {
  background-color: #383e54;
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.k-drawer-items) {
  background-color: #383e54;
}

:deep(.k-drawer-item) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.k-drawer-item.k-selected),
:deep(.k-drawer-item:hover) {
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
}
</style>
