<template>
  <div style="height: 100%; padding: 2%;">
    <header id="top">
      <img id="logo" src="../assets/images/cryptonite_logo.png">
      <h1 id="title">Comment Scouting</h1>
    </header>

    <main id="comments">
      <div class="textboxes">
        <div>
          <TextField :class="'scouts-initials-textfield'" constraints="Initials" label="Scout's Initials:" :maxlength=2 />
        </div>
        <div>
          <TextField :class="'team-number-textfield'" constraints="Numbers" :filterFile="teamsJSON.teams"
            label="Team Number: " :maxlength=5 />
        </div>
        <div>
          <TextField :class="'match-number-textfield'" constraints="Numbers" label="Match Number:" :maxlength=2
            initialValue="1" />
        </div>
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
      <div class="textboxes">
        <div>
          <TextField :class="'additional-comments-textfield'" constraints="Text" label="Additional Comments:"
            :maxlength=200 />
        </div>
      </div>
      <Button label="Submit to Database"></Button>
    </main>
  </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';
import optionsJSON from '../data/options.json';
import teamsJSON from '../data/teams.json';
import TextField from '../components/TextField.vue';
import Dropdown from '../components/Dropdown.vue';
import Button from '../components/Button.vue'
import { useFormStore } from '../state_management/formStore.ts';

const formStore = useFormStore();

const submissionData = formStore.submissionData;

const optionList = ref(optionsJSON);
function refresh() {
  window.location.href = window.location.href;
}

setTimeout(refresh, 1000000);

watch(
  () => [formStore.getValue("Scout's Initials"), formStore.getValue("Team Number")],
  async ([scoutInitials, teamNumber]) => {
    if (scoutInitials == '' || teamNumber == '') {
      optionList.value.forEach(option => {
        formStore.setValue(option.optionLabel, '');
      });
    }
  }
);

function onChange(event, key) {
  formStore.setValue(key, event.target.value);
  printSubmissionData();
}

function printSubmissionData() {
  console.log("----- Submission Data -----");
  formStore.submissionData.forEach((value, key) => {
    console.log(key + ' = ' + value);
  });
  console.log("--------------------");
}
</script>
  
<style>
:root {
  --option-grid-gap: 20px;
}

#logo {
  max-width: 20%;
  height: 20%;
  margin-right: auto;
}


#top {
  width: auto;
}

#comments {
  display: grid;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  gap: 30px;
  width: 50%;
  min-width: fit-content;
}

#title {
  font-family: 'Lemon/Milk', 'Futura PT';
  margin: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  width: auto;
  height: auto;
  top: 0;
  font-size: calc(100% + 1.8vw);
}

#options {
  display: flex;
  flex-direction: row;
  align-items: middle;
  justify-content: center;
}

#optionLabels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: calc(var(--option-grid-gap) + 13px);
}

#dropdowns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--option-grid-gap);
  width: fit-content;
}

.textboxes {
  display: grid;
  gap: 20px;
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
  
  