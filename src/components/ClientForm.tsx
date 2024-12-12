import { ClientRecord } from '@/util/util';
import {
  EuiButton,
  EuiFieldText,
  EuiFlexGroup,
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiTextArea
} from '@elastic/eui';
import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/ClientForm.module.css';


interface EditFormProps {
  client: ClientRecord;
  onSave: (data: ClientRecord) => void;
  onCancel: () => void;
  isAdmin: boolean
}

const EditForm: FunctionComponent<EditFormProps> = ({ client, onSave, onCancel, isAdmin }) => {
  const { handleSubmit, setValue, watch, control, register, formState: { errors } } = useForm<ClientRecord>({
    defaultValues: client,
  });

  const data = watch()

  const onSubmit = (data: ClientRecord) => {
    onSave(data);
  };

  return (
    <EuiForm component="form" onSubmit={handleSubmit(onSubmit)}>
      <EuiFormRow label="Name">
        <EuiFieldText disabled={!isAdmin} value={data.name} onChange={e => setValue('name', e.target.value)} />
      </EuiFormRow>

      <EuiFormRow label="Industry">
        <EuiFieldText disabled={!isAdmin} value={data.industry} onChange={e => setValue('industry', e.target.value)} />
      </EuiFormRow>

      <EuiFormRow label="Email">
        <EuiFieldText disabled={!isAdmin} value={data.email} onChange={e => setValue('email', e.target.value)} />
      </EuiFormRow>

      <EuiFormRow label="Phone">
        <EuiFieldText disabled={!isAdmin} value={data.phone} onChange={e => setValue('phone', e.target.value)} />
      </EuiFormRow>

      <EuiSpacer size='m'/>
  <div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Preferred Date</label>
        <input
          type="date"
          {...register("date", { required: "Please select a date" })}
          className={styles.input}
        />
        {errors.date && <p className={styles.error}>{errors.date.message}</p>}
      </div>
      <EuiSpacer size='m'/>

      <div className={styles.formGroup}>
        <label className={styles.label}>Preferred Time</label>
        <input
          type="time"
          {...register("time", { required: "Please select a time" })}
          className={`${styles.input} ${styles.timeInput}`}
        />
        {errors.time && <p className={styles.error}>{errors.time.message}</p>}
      </div>
    </div>
    <EuiSpacer size='m' />

      <EuiFormRow label="Requirements">
        <EuiTextArea value={data.reason} onChange={e => setValue('reason', e.target.value)} />
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
