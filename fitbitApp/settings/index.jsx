function HRMSettings(props) {
  return (
    <Page>
      <Section title={<Text bold align="center">HRM Server</Text>}>
          <TextInput label="Server Url" settingsKey="serverUrl"/>
      </Section>
      <Section title={<Text bold align="center">User Id</Text>}>
          <TextInput label="User Id" settingsKey="userId"/>
      </Section>
    </Page>
  );
}

registerSettingsPage(HRMSettings);
