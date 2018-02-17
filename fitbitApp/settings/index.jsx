function HRMSettings(props) {
  return (
    <Page>
      <Section title={<Text bold align="center">HRM Server</Text>}>
          <TextInput label="Server Url" settingsKey="serverUrl"/>
      </Section>
    </Page>
  );
}

registerSettingsPage(HRMSettings);
