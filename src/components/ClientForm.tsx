import { ClientRecord } from '@/util/util';
import {
  EuiButton,
  EuiDatePicker,
  EuiFieldText,
  EuiFlexGroup,
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSwitch,
  EuiTextArea
} from '@elastic/eui';
import moment, { Moment } from 'moment';
import { FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface EditFormProps {
  client: ClientRecord;
  onSave: (data: ClientRecord) => void;
  onCancel: () => void;
}

const EditForm: FunctionComponent<EditFormProps> = ({ client, onSave, onCancel }) => {
  const { handleSubmit, setValue, watch, getValues, control } = useForm<ClientRecord>({
    defaultValues: client,
  });

  const data = watch()

  const onSubmit = (data: ClientRecord) => {
    onSave(data);
  };

  return (
    <EuiForm component="form" onSubmit={handleSubmit(onSubmit)}>
      <EuiFormRow label="Name">
        <EuiFieldText value={data.name} onChange={e => setValue('name', e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="Industry">
        <EuiFieldText value={data.industry} onChange={e => setValue('industry', e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="Email">
        <EuiFieldText value={data.email} onChange={e => setValue('email', e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="Phone">
        <EuiFieldText value={data.phone} onChange={e => setValue('phone', e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="Scheduled Date">
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <EuiDatePicker
              selected={field.value ? moment(field.value) : null}
              onChange={(date: Moment | null) => {
                if (date) {
                  setValue('date', date.format('YYYY-MM-DD hh:mm A'));
                }
              }}
              showTimeSelect
              dateFormat="YYYY-MM-DD hh:mm A"
              timeFormat="hh:mm A"
              timeIntervals={5}
            />
          )}
        />
      </EuiFormRow>

      <EuiFormRow label="Requirements">
        <EuiTextArea value={data.requirements} onChange={e => setValue('requirements', e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="Wants to sign NDA">
        <EuiSwitch checked={data.nda} onChange={e => setValue('nda', e.target.checked)} label="NDA" />
      </EuiFormRow>
      <EuiFormRow label="City">
        <EuiFieldText value={data.city} onChange={e => setValue('city', e.target.value)} />
      </EuiFormRow>
      <EuiFormRow label="Contacted Channel">
        <EuiSelect
          onChange={e => setValue('contactedChannel', e.target.value as 'Call' | "WhatsApp" | 'VoiceMail' | 'Email')}
          value={data.contactedChannel}
          hasNoInitialSelection={true}
          options={[
            { value: undefined, text: undefined, hidden: true },
            { value: 'Call', text: 'Call' },
            { value: 'WhatsApp', text: 'WhatsApp' },
            { value: 'VoiceMail', text: 'VoiceMail' },
            { value: 'Email', text: 'Email' },
          ]}
        />
      </EuiFormRow>
      <EuiFormRow label="Responded">
        <EuiSwitch checked={data.responded || false} onChange={e => setValue('responded', e.target.checked)} label="Responded" />
      </EuiFormRow>
      <EuiFormRow label="Is Interested">
        <EuiSwitch checked={data.isInterested || false} onChange={e => setValue('isInterested', e.target.checked)} label="Is Interested" />
      </EuiFormRow>
      <EuiFormRow label="Remarks">
        <EuiFieldText value={data.remarks} onChange={e => setValue('remarks', e.target.value)} />
      </EuiFormRow>
      <EuiFormRow>
        <EuiFlexGroup>
          <EuiButton type="submit" fill>
            Save
          </EuiButton>
          <EuiButton onClick={onCancel}>Cancel</EuiButton>
        </EuiFlexGroup>
      </EuiFormRow>
    </EuiForm>
  );
};

export default EditForm;
