<template>

  <header id="top">
    <h1 id="Title">Comment Scouting</h1>
  </header>

  <main>
    <div id="textboxes">
      <TextField id="ScoutInfo" constraints="Initials" label="Scout's Initials:" :maxlength=2 />
      <TextField id="TeamsInfo" constraints="Numbers" :filterFile="teamsJSON.teams" label="Team Number: " :maxlength=5 />
    </div>

    <section id="options">
      <div id="optionLabels">
        <div class="optionLabel" v-for="(option, index) in optionList" :key="index">
          <label>{{ option.optionLabel }}</label>
        </div>
      </div>
      <div id="dropdowns">
        <Dropdown v-for="(option, index) in optionList" :key="index" :value="option.optionLabel" :options="option"
          @change="onChange($event, option.optionLabel)" />
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

// Initialize the submission map and make it available to child components
const submissionMap = ref(new Map());
provide('submissionMap', submissionMap);

const optionList = ref(optionsJSON);

watch(
  () => [submissionMap.value.get("Scout's Initials"), submissionMap.value.get("Team Number")],
  async ([scoutInitials, teamNumber]) => {
    if (scoutInitials !== '' || teamNumber !== '') {
      optionList.value.forEach(option => {
        submissionMap.value.set(option.optionLabel, '');
      });
    }
  }
);

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

main{
  display: flex;
  flex-direction: column;
  align-content: middle;
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

#options {
  display: flex;
  flex-direction: row;
  align-content: middle;
}

#optionLabels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: calc(var(--grid-gap) + 13px);
}

#dropdowns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--grid-gap);
}

#textboxes {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: center;

  color: var(--color-text);
  top: -100px;
}

.optionLabel {
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

