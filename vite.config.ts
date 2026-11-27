import { defineConfig } from 'vite'
import {resolve} from 'node:path'
export default defineConfig({
  build:{
    outDir:'docs',
    rolldownOptions:{
      input:{
        main:resolve(import.meta.dirname,'index.html'),
        budget:resolve(import.meta.dirname,'budget/index.html'),
        setBudget:resolve(import.meta.dirname,'setBudget/index.html')
      }}},
  base:'/CIS3308-FinalProject/'
})