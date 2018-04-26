import React, { Component } from 'react';
import { Bar, Line, HorizontalBar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { getUser, getStudent } from '../../redux/user';
import LoadData from '../../components/LoadData/LoadData'
import _ from 'underscore';
//CSS, ASSETS
import './Chart.css'
class Chart extends Component {
    constructor() {
        super()
        this.state = {
            selectedCourseID: -1,
            selectedCourse: '',
            windowWidth: -1,
            selectedAssignmentTemplateID:-1,
            chartType:'Bar'
        }
        this.selectCourse = this.selectCourse.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount(){
        this.setState({ windowWidth: window.innerWidth});
    }
    updateWindowDimensions(){
        window.addEventListener('resize', this.updateWindowDimensions);
        // this.setState({ windowWidth: window.innerWidth});
    }

    selectCourse(courseValues) {
        this.setState({
            selectedCourseID: courseValues[0],
            selectedCourse: courseValues[1]
        })
    }

    render() {
        let chartTitleFont = (this.state.windowWidth > 1024) ? 30 : (this.state.windowWidth > 375) ? 20 : 10;
// =========== CURRENT STUDENT DATA ============
        let studentData = this.props.student;
// ====== DISPLAY BUTTONS TO SELECT CHART ======
        let buttonType = ["Bar", "Line", "Horizontal Bar"];
        let chartButtons = buttonType.map((element, index) => {
            return <button className="course_btn" key={index} id={`course_button${index}`} onClick={() => {this.setState({chartType:element})}}>{element}</button>
        })
// ====== FIND STUDENT ASSIGNMENTS SCORES ======
        let studentAssignmentScores = studentData.getAssignments ? studentData.getAssignments.map(obj => {
            if (obj.student_assignments_course_id === this.state.selectedCourseID){ return (obj.points_earned / obj.possible_points)*100} else return null
        }).filter(value => value):[]
// ============ FIND AVERAGE SCORES ============      
        let averageScores = studentData.getAssignments ? studentData.classAverage.map(obj => {
            if (obj.assignment_name === this.state.selectedAssignmentTemplateID){ return (obj.classmates_points_earned / obj.possible_points)*100} else return null
        }).filter(value => value):[]
// ============ FIND ASSIGNMENTS ID ============
        let assignmentIDs = studentData.getAssignments ? studentData.getAssignments.map(obj => {
            if (obj.student_assignments_course_id === this.state.selectedCourseID){ return obj.student_assignment_id } else return null
        }).filter(value => value):[]
// =========== FIND ASSIGNMENTS NAME ===========
        let assignmentNames = studentData.getAssignments ? (assignmentArray)=> studentData.getAssignments.map(obj => {
            if (assignmentArray.indexOf(obj.student_assignment_id) > -1 ){ return obj.assignment_name} else return null
        }).filter(value => value):(placeholder)=>{return []}
// =========== FIND STUDENT COURSES ===========
        var studentCourses = studentData.getCourses ?             
        studentData.getCourses.map(value => {return { courseID: value.course_id, courseName: value.course_name }}) :[]
// ========= DISPLAY COURSE BUTTONS ===========
        let courseButtons = _.uniq(studentCourses).map((element, index) => {
            return <button className="course_btn" key={index} value={element.courseID} onClick={(e) => {this.selectCourse([element.courseID, element.courseName])}}>{element.courseName}</button>
        })
 // ================ CHART DATA ===============   
        let chartData = {
              labels: assignmentNames(assignmentIDs)
            , type: 'polarArea'
            , datasets: [{
                  label: 'Student Score'
                , data: studentAssignmentScores
                , backgroundColor: [
                    'rgba(255, 99, 132, .8)',
                    'rgba(54, 162, 235, .8)',
                    'rgba(255, 206, 86, .8)',
                    'rgba(75, 192, 192, .8)',
                    'rgba(153, 102, 255, .8)',
                    'rgba(255, 159, 64, .8)'
                ],
            },{
                 label: 'Average Score'
                , data: averageScores
            }]
        }
 // ============= CHART OPTION DATA ============           
        let chartOptionData = {
            title: {
                  display: true
                , text: `${this.state.selectedCourse === '' ? "Please select a course" : `Assignment Scores for ${this.state.selectedCourse}`}`
                , fontSize: chartTitleFont
            },
            legend: {
                  display: true
                , position: 'top'
            }}
 // ======= DISPLAY BAR, LINE, and HORIZONTAL BAR CHARTS ========               
        let barChart =  studentData.getAssignments ? <Bar className="test_chart" data={chartData} options={chartOptionData}/>: <LoadData/>
        let lineChart = <Line className="test_chart" data={chartData} options={{chartOptionData}}/>
        let HorizontalBarChart = <HorizontalBar className="test_chart" data={chartData} options={chartOptionData}/>
 // ============= RETURN ============      
    return ( 
        <div className="course-container">            
            <div className="left-column">
                <div className="title-bar">{`Welcome to Homeroom`}</div>
                <section className="home-section">
                {"All schools in the Salt Lake City District use Homeroom as the Learning Management System (LMS), which means all of your online courses will be in Homeroom. The course content will be available by the first day of classes."}
                </section>
                <div className="title-bar">{`Please select a chart type`}</div>
                <section className="home-section">
                <div className="chartButtonsWrapper">{chartButtons}</div>
                </section>
                <div className="title-bar">{`Homeroom Recommendations`}</div>
                <section className="home-section">
                {"Nothing to display"}
                </section>
                <div className="title-bar">{`Teachers Recommendations`}</div>
                <section className="home-section">
                {"Nothing to display"}
                </section>
            </div>
            <div className="right-column">
                <section className="home-section">
                    <h1 className="course-title">{`Display ${this.props.user.first_name}'s grade averages`}</h1>
                    <div className="test_chart_wrapper">   
                        {this.state.chartType === "Bar" ? barChart: this.state.chartType === "Line" ? lineChart:this.state.chartType === "Horizontal Bar" ? HorizontalBarChart : barChart}
                        {this.state.chartType !== '' ? <div className="coursesButtonsWrapper">{courseButtons}</div>: null}      
                    </div>
                </section>
            </div>
        </div>     
        )
    }
}
function mapStateToProps(state) {
    return {
        user:state.user
        , student:state.student 
    }
}
export default connect(mapStateToProps, {getUser,getStudent})(Chart);