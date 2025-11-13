<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@progress/kendo-vue-inputs'

const name = ref('Doug')
</script>

<template>
  <section class="prose dark:prose-invert max-w-none space-y-4">
    <h2>Profile</h2>
    <div class="k-form-field">
      <label class="k-label">Name</label>
      <Input v-model="name" />
    </div>
  </section>
</template>
