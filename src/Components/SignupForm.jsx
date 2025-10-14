import React, { useEffect } from 'react';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, MenuItem, Select, InputLabel, Grid, IconButton, Box } from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add, Remove } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useUsers } from '../context/UserContext';


const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
        'Password must be at least 6 characters and include an uppercase letter, number, and special character'
    ).min(6).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    gender: yup.string().required(),
    dob: yup.date().required('Date of Birth is required').nullable(),
    profileType: yup.string().required(),
    phoneNumbers: yup.array().of(yup.number().typeError('Phone number must be a number').required('Phone number is required')),
    addresses: yup.array().of(
        yup.object().shape({
            street: yup.string().required('Street is required'),
            city: yup.string().required('City is required'),
            state: yup.string().required('State is required'),
            zip: yup.string().required('ZIP Code is required')
        })
    ),
    relatives: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Name is required'),
            relationship: yup.string().required('Relationship is required'),
            age: yup.number().typeError('Age is required').required('Age is required'),
        })
    )
});

const SignupForm = () => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: '',
            dob: null,
            profileType: '',
            phoneNumbers: [''],
            addresses: [{ street: '', city: '', state: '', zip: '' }],
            relatives: [{ name: '', relationship: '', age: '' }]
        },
    });


    const { fields: phonefields, append: addphone, remove: removephone } = useFieldArray({ control, name: 'phoneNumbers' });

    const { fields: addressFields, append: addAddress, remove: removeAddress } = useFieldArray({ control, name: 'addresses' });

    const { fields: relativeFields, append: addRelative, remove: removeRelative } = useFieldArray({ control, name: 'relatives' });

    const { addUser } = useUsers();
    const onSubmit = (data) => {
        console.log(data);
        addUser(data);
        reset({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: '',
            dob: null,
            profileType: '',
            phoneNumbers: [''],
            addresses: [{ street: '', city: '', state: '', zip: '' }],
            relatives: [{ name: '', relationship: '', age: '' }]
        });
    };

    if (phonefields.length < 1) {
        addphone('');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
            <Grid container spacing={2}>

                <Grid gridColumn={6}>
                    <TextField label="First Name" fullWidth {...register('firstName')} error={!!errors.firstName} helperText={errors.firstName?.message} />
                </Grid>
                <Grid gridColumn={6}>
                    <TextField label="Last Name" fullWidth {...register('lastName')} error={!!errors.lastName} helperText={errors.lastName?.message} />
                </Grid>
                <Grid gridColumn={12}>
                    <TextField label="Email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
                </Grid>
                <Grid gridColumn={6}>
                    <TextField label="Password" type="password" fullWidth {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
                </Grid>
                <Grid gridColumn={6}>
                    <TextField label="Confirm Password" type="password" fullWidth {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
                </Grid>


                <Grid gridColumn={12}>
                    <FormControl component="fieldset" error={!!errors.gender}>
                        <FormLabel component="legend">Gender</FormLabel>
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <RadioGroup row {...field}>
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                </Grid>

                <Grid gridColumn={6}>
                    <Controller
                        control={control}
                        name="dob"
                        render={({ field }) => (
                            <DatePicker
                                label="Date of Birth"
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(date) => field.onChange(date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors.dob,
                                        helperText: errors.dob?.message,
                                    },
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid gridColumn={12}>
                    <FormControl>
                        <InputLabel>Profile Type</InputLabel>
                        <Controller
                            name="profileType"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} label="Profile Type" fullWidth error={!!errors.profileType} helpertext={errors.profileType?.message}>
                                    <MenuItem value="personal">Personal</MenuItem>
                                    <MenuItem value="business">Business</MenuItem>
                                </Select>
                            )}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    {phonefields.map((field, index) => (
                        <Box key={field.id} display="flex" alignItems="center" gap={1} mb={1}>
                            <TextField
                                fullWidth
                                type="number"
                                placeholder="Enter phone number"
                                variant='outlined' 
                                label={'Phone Number'}
                                {...register(`phoneNumbers.${index}`, { valueAsNumber: true })}
                                error={!!errors.phoneNumbers?.[index]}
                                helperText={errors.phoneNumbers?.[index]?.message}
                            />
                            <IconButton onClick={() => removephone(index)} disabled={phonefields.length === 1}>
                                <Remove />  
                            </IconButton>
                            <IconButton onClick={() => addphone('')}>
                                <Add />
                            </IconButton>
                        </Box>
                    ))}
                </Grid>         

                <Grid gridColumn={12}>
                    <FormLabel>Addresses</FormLabel>
                    {addressFields.map((field, index) => (
                        <Box key={field.id} mb={2} border="1px solid #ccc" p={2} borderRadius={2}>
                            <Grid container spacing={2}>
                                <Grid gridColumn={6}>
                                    <TextField label="Street" fullWidth {...register(`addresses.${index}.street`)} error={!!errors.addresses?.[index]?.street} helperText={errors.addresses?.[index]?.street?.message} />
                                </Grid>
                                <Grid gridColumn={6}>
                                    <TextField label="City" fullWidth {...register(`addresses.${index}.city`)} error={!!errors.addresses?.[index]?.city} helperText={errors.addresses?.[index]?.city?.message} />
                                </Grid>
                                <Grid gridColumn={6}>
                                    <TextField label="State" fullWidth {...register(`addresses.${index}.state`)} error={!!errors.addresses?.[index]?.state} helperText={errors.addresses?.[index]?.state?.message} />
                                </Grid>
                                <Grid gridColumn={6}>
                                    <TextField label="ZIP Code" fullWidth {...register(`addresses.${index}.zip`)} error={!!errors.addresses?.[index]?.zip} helperText={errors.addresses?.[index]?.zip?.message} />
                                </Grid>
                                <Grid gridColumn={12}>
                                    <IconButton onClick={() => removeAddress(index)} disabled={addressFields.length === 1}><Remove /></IconButton>
                                    <IconButton onClick={() => addAddress({ street: '', city: '', state: '', zip: '' })}><Add /></IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Grid>


                <Grid gridColumn={12}>
                    <FormLabel>Relatives</FormLabel>
                    {relativeFields.map((field, index) => (
                        <Box key={field.id} mb={2} border="1px solid #ccc" p={2} borderRadius={2}>
                            <Grid container spacing={2}>
                                <Grid gridColumn={6}>
                                    <TextField label="Name" fullWidth {...register(`relatives.${index}.name`)} error={!!errors.relatives?.[index]?.name} helperText={errors.relatives?.[index]?.name?.message} />
                                </Grid>
                                <Grid gridColumn={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Relationship</InputLabel>
                                        <Controller
                                            name={`relatives.${index}.relationship`}
                                            control={control}
                                            render={({ field }) => (
                                                <Select {...field} label="Relationship">
                                                    <MenuItem value="parent">Parent</MenuItem>
                                                    <MenuItem value="sibling">Sibling</MenuItem>
                                                    <MenuItem value="child">Child</MenuItem>
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid gridColumn={3}>
                                    <TextField label="Age" type="number" fullWidth {...register(`relatives.${index}.age`)} error={!!errors.relatives?.[index]?.age} helperText={errors.relatives?.[index]?.age?.message} />

                                </Grid>
                                <Grid gridColumn={12}>
                                    <IconButton onClick={() => removeRelative(index)} disabled={relativeFields.length === 1}><Remove /></IconButton>
                                    <IconButton onClick={() => addRelative({ name: '', relationship: '', age: '' })}><Add /></IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Grid>
            </Grid>
            <Grid gridColumn={12}>
                <Button type="submit" variant="contained" color="primary">Register</Button>
            </Grid>
        </form>
    );
};

export default SignupForm;
