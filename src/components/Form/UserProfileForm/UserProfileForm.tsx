import * as React from "react";
import { Grid, TextField } from "@mui/material";
import classes from "./UserProfileForm.module.scss";
import { useEffect, useState } from "react";
import Avatar from "../../Avatar/Avatar";
import { getAvatarURL } from "../../../api/auth.api";
import useUpdateUserProfile from "../../../hooks/use-update-user-profile";
import { UserUpdate } from "../../../types/model/userUpdate";
import SaveIcon from "@mui/icons-material/Save";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../store/acthAction";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import DefaultAvatar from "../../../assets/images/defaultAvatar.jpg";
import { RootState } from "../../../store";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type SelectSmallProps = {
	handleChangeGender: (event: SelectChangeEvent) => void;
	genderOptions: { label: string; value: boolean | null }[];
	gender: boolean | null;
};

const SelectSmall = ({ handleChangeGender, genderOptions, gender }: SelectSmallProps) => {
	return (
		<FormControl className={classes.select} size="small">
			<Select
				labelId="demo-select-small-label"
				id="demo-select-small"
				value={gender !== null ? gender.toString() : "None"}
				onChange={handleChangeGender}
			>
				{genderOptions.map(option => (
					<MenuItem value={option.value?.toString() || ""}>{option.label}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

const UserProfileForm = (): React.JSX.Element => {
	const [loadingUploadAvatar, setLoadingUploadAvatar] = useState(false);
	const [photoURL, setPhotoURL] = useState(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isChanging, setIsChanging] = useState(false);
	const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
	const user = useSelector((state: RootState) => state.auth.login.currentUser);
	const dispatch = useDispatch();

	const [gender, setGender] = React.useState<boolean | null>(null);

	const genderOptions = [
		{ label: "None", value: null },
		{ label: "Male", value: true },
		{ label: "Female", value: false }
	];

	const handleChangeGender = (event: SelectChangeEvent) => {
		setIsChanging(true);
		const selectedValue = event.target.value;
		if (selectedValue !== null) {
			const selectedOption = genderOptions.find(option => option?.value?.toString() === selectedValue);
			selectedOption && setGender(selectedOption.value);
		} else {
			setGender(null);
		}
	};

	const [userUpdate, setUserUpdate] = useState<UserUpdate>({
		name: "",
		phoneNumber: "",
		avatar: "",
		dateOfBirth: null,
		gender: null,
		description: ""
	});

	const updateUserProfile = useUpdateUserProfile();

	useEffect(() => {
		setDateOfBirth(user?.dateOfBirth ? dayjs(user?.dateOfBirth) : null);
		setGender(user?.gender ?? null);
		setUserUpdate({
			name: user?.name ?? "",
			phoneNumber: user?.phoneNumber ?? "",
			avatar: user?.avatar ?? "",
			dateOfBirth: user?.dateOfBirth ?? null,
			gender: user?.gender ? true : false,
			description: user?.description ?? ""
		});
	}, [user]);

	const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target?.files?.[0];
		setLoadingUploadAvatar(true);
		setIsChanging(true);
		if (file) {
			// const errorMessage = validateFileImage(file);
			// if (errorMessage) {
			// 	toast.error(errorMessage);
			// 	event.target.value = "";
			// 	return;
			// }
			// setFile(file);
			const reader = new FileReader();
			reader.onload = async (e: ProgressEvent<FileReader>) => {
				console.log(e.target?.result);
				const formData = new FormData();
				formData.append("file", file);
				const res = await getAvatarURL(formData);
				setPhotoURL(res.data.url);
				setLoadingUploadAvatar(false);
			};
			reader.readAsDataURL(file);
			event.target.value = "";
		}
	};

	const handleFieldChange = (fieldName: string, value: string) => {
		setIsChanging(true);
		setUserUpdate({
			...userUpdate,
			[fieldName]: value
		});
	};

	const handleSave = async () => {
		setIsSaving(true);
		const data = {
			...userUpdate,
			gender: gender,
			avatar: photoURL ?? user?.avatar ?? "",
			dateOfBirth: dateOfBirth?.format("YYYY-MM-DD") ?? null
		};
		try {
			await updateUser(data, dispatch);
			await updateUserProfile.mutateAsync(data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsSaving(false);
			setIsChanging(false);
		}
	};

	return (
		<Grid container className={classes.wrapperUserProfile}>
			<Grid item xs={12} className={classes.title}>
				Personal Profile
			</Grid>
			<Grid item xs={10} className={classes.wrapperFormUser}>
				<form>
					<Grid item xs={12} className={classes.wrapperAvatar}>
						<Avatar
							loadingUploadAvatar={loadingUploadAvatar}
							handleChangeAvatar={handleChangeAvatar}
							photoURL={photoURL ? photoURL : user?.avatar ? user?.avatar : DefaultAvatar}
						/>
					</Grid>
					<Grid item xs={12} className={classes.wrapperRowInput}>
						<Grid item xs={5} className={classes.wrapperInput}>
							<div className={classes.text}>Name</div>
							<TextField
								id="standard-basic1"
								variant="standard"
								sx={{
									"& input": {
										fontSize: "16px",
										fontFamily: "K2D"
									}
								}}
								className={classes.inputField}
								value={userUpdate?.name ?? ""}
								onChange={e => handleFieldChange("name", e.target.value)}
							/>
						</Grid>
						<Grid item xs={5} className={classes.wrapperInput}>
							<div className={classes.text}>Email</div>
							<TextField
								id="standard-basic1"
								variant="standard"
								sx={{
									"& input": {
										fontSize: "16px",
										fontFamily: "K2D"
									}
								}}
								className={classes.inputField}
								value={user?.email ?? ""}
								disabled={true}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.wrapperRowInput}>
						<Grid item xs={5} className={classes.wrapperInput}>
							<div className={classes.text}>Phone Number</div>
							<TextField
								id="standard-basic3"
								variant="standard"
								sx={{
									"& input": {
										fontSize: "16px",
										fontFamily: "K2D"
									}
								}}
								className={classes.inputField}
								value={userUpdate?.phoneNumber ?? ""}
								onChange={e => handleFieldChange("phoneNumber", e.target.value)}
							/>
						</Grid>
						<Grid item xs={5} className={classes.wrapperInput}>
							<div className={classes.text}>Gender</div>
							<SelectSmall
								handleChangeGender={handleChangeGender}
								genderOptions={genderOptions}
								gender={gender}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.wrapperRowInput}>
						<Grid item xs={5} className={classes.wrapperInput}>
							<div className={classes.text}>Description</div>
							<TextField
								id="standard-basic5"
								variant="standard"
								sx={{
									"& input": {
										fontSize: "16px",
										fontFamily: "K2D"
									}
								}}
								className={classes.inputField}
								value={userUpdate?.description ?? ""}
								onChange={e => handleFieldChange("description", e.target.value)}
							/>
						</Grid>
						<Grid item xs={5} className={classes.wrapperInput}>
							<div className={classes.text}>Date Of Birth</div>
							<DatePicker
								slotProps={{
									textField: {
										size: "small",
										variant: "outlined"
									}
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										fontSize: "16px",
										fontFamily: "K2D"
									}
								}}
								format="YYYY-MM-DD"
								value={dateOfBirth}
								onChange={date => {
									setDateOfBirth(dayjs(date));
									setIsChanging(true);
								}}
								className={classes.datePicker}
							/>
						</Grid>
					</Grid>
					<Grid item xs={12} className={classes.wrapperButton}>
						<LoadingButton
							size="small"
							className={classes.buttonSave}
							onClick={handleSave}
							loading={isSaving}
							loadingPosition="start"
							startIcon={<SaveIcon />}
							variant="contained"
							disabled={!isChanging}
						>
							<span>Save</span>
						</LoadingButton>
					</Grid>
				</form>
			</Grid>
		</Grid>
	);
};

export default UserProfileForm;
