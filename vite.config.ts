import { defineConfig } from 'vite'
import {resolve} from 'node:path'
export default defineConfig({
  build:{
    outDir:'docs',
    rolldownOptions:{
      input:{
        main:resolve(import.meta.dirname,'index.html'),
        budget:resolve(import.meta.dirname,'budget/BudgetPage.html'),
        setBudget:resolve(import.meta.dirname,'setBudget/setBudgetPage.html')
      }}},
  base:'/CIS3308-FinalProject/'
})