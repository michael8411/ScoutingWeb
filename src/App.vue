<template>
  <header id="top">
    <h1 id="Title">Comment Scouting</h1>
  </header>

  <main>
    <div id="scoutTextBox">
      <TextField id="ScoutInfo" constraints="Initials" label="Scout's Initials:" :maxlength=2 />
      <TextField id="TeamsInfo" constraints="Numbers" :filterFile="teamsJSON.teams" label="Team Number: " :maxlength=5 />
    </div>

    <section id="comments">
      <div id="commentNames">
        <div class="commentName" v-for="(option, index) in optionList">
          <label>{{ option.commentName }}</label>
        </div>
      </div>
      <div id="dropdowns">
        <Dropdown v-for="(option, index) in optionList" :key="index" :value="option.commentName" :options="option"
          @change="onChange($event, option.commentName)" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, provide, watch } from 'vue';
import optionsJSON from './data/options.json';
import teamsJSON from './data/teams.json';
import TextField from './components/TextField.vue';
import Dropdown from './components/Dropdown.vue';

const submissionMap = ref(new Map());
provide('submissionMap', submissionMap);

const alphabet = "[0-9]";
const numbers = "[A-Za-z]";

const optionList = ref(optionsJSON);

(async () => {
  while (
    submissionMap.value.get("Scout's Initials") !== '' ||
    submissionMap.value.get("Team Number") !== ''
  ) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  optionList.value.forEach(option => {
    submissionMap.value.set(option.commentName, '');
  });
})();

function refresh() {
  window.location.href = window.location.href;
}

function onChange(event, key) {
  submissionMap.value.set(key, event.target.value);

  for (let [key, value] of submissionMap.value) {
    console.log(key + ' = ' + value);
  }
  console.log("--------------------");
}

</script>



<style>
:root {
  --grid-gap: 20px;
}

#Title {
  font-family: 'Lemon/Milk', 'Futura PT';
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: middle;
  vertical-align: middle;
  width: 300px;
  top: 0;
}

#comments {
  display: flex;
  flex-direction: row;
  align-content: middle;
}

#commentNames {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: calc(var(--grid-gap) + 13px);
}

#dropdowns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--grid-gap);
}

#scoutTextBox {
  display: flex;
  flex-direction: row;
  align-content: middle;
  justify-content: center;
  color: var(--color-text);
  top: -100px;
}

.commentName {
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  vertical-align: middle;
  width: fit-content;
  padding-right: 0.5em;
  padding-left: 0.5em;
}
</style>

