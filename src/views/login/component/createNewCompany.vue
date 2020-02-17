<template>
  <div class="register-box">
    <template v-if="!showNextStep">
      <div class="cell">
        <div class="cell-box">
          <el-input
            ref="realname"
            :class="{error: !validateRes.realname}"
            v-model="form.realname"
            placeholder="姓名" />
        </div>
        <div class="cell-box">
          <el-select
            ref="position"
            :class="{error: !validateRes.position}"
            v-model="form.position"
            placeholder="职位">
            <el-option
              v-for="item in positionList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>

      <div class="cell">
        <div class="cell-box">
          <el-input
            ref="company_name"
            :class="{error: !validateRes.company_name}"
            v-model="form.company_name"
            placeholder="公司" />
        </div>
        <div class="cell-box">
          <el-select
            ref="scale"
            :class="{error: !validateRes.scale}"
            v-model="form.scale"
            placeholder="使用人数">
            <el-option
              v-for="item in scaleList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>

      <div class="cell">
        <div class="cell-box">
          <el-select
            ref="trade"
            :class="{error: !validateRes.trade}"
            v-model="form.trade"
            placeholder="行业">
            <el-option
              v-for="item in tradeList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
        <div class="cell-box">
          <el-select
            ref="area"
            :class="{error: !validateRes.area}"
            v-model="form.area"
            placeholder="地区">
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>

      <div class="cell">
        <div class="cell-box">
          <el-input
            ref="phone"
            :class="{error: !validateRes.phone}"
            v-model="form.phone"
            placeholder="手机号"/>
        </div>
        <div class="empty">
          &nbsp;
        </div>
        <div class="cell-box">
          <el-input
            ref="discount"
            :class="{error: !validateRes.discount}"
            v-model="form.discount"
            placeholder="邀请码（选填）" />
        </div>
      </div>

      <el-popover
        v-model="showSlideVerify"
        :disabled="isUser || !canVerify"
        placement="top-start"
        width="350"
        popper-class="no-padding-popover"
        trigger="click">
        <slide-verify
          :phone="form.mobile"
          slider-text="向右滑动"
          @success="sliderSuccess"
          @fail="sliderFail"
          @refresh="sliderRefresh"
          @close="showSlideVerify = false" />
        <div
          slot="reference"
          :class="{success: isUser}"
          class="verify-picture"
          @click="imgVerifyClick">
          <template v-if="!isUser">
            <img
              src="~@/assets/login/verify_picture.png"
              alt=""
              class="icon">
            <span class="text">点击完成验证</span>
          </template>
          <template v-else>
            <img
              src="~@/assets/login/verify_success.png"
              alt=""
              class="icon">
            <span class="text">验证成功</span>
          </template>
        </div>
      </el-popover>

      <div class="sms-box">
        <el-input
          ref="smscode"
          v-model.trim="form.smscode"
          :class="{error: !validateRes.smscode}"
          placeholder="请输入短信验证码" />
        <el-button
          :disabled="time !== second"
          @click="getSmsCode">
          <div class="btn-content">
            <template v-if="time === second">
              <span>获取验证码</span>
            </template>
            <template v-else>
              <span>重新发送({{ second }}s)</span>
            </template>
          </div>
        </el-button>
      </div>

      <div class="service-law">
        <el-checkbox v-model="agreeLaw">
          我同意
        </el-checkbox>
        <span class="special" @click.stop="dialogVisible = !dialogVisible">《悟空CRM用户协议》</span>
      </div>
    </template>

    <template v-else>
      <div class="row">
        <!--<el-input
          ref="password"
          :class="{error: !validateRes.password}"
          v-model="form.password"
          type="password"
          placeholder="密码" />-->

        <el-popover
          v-model="pwdPopover"
          :width="width"
          placement="bottom-start"
          popper-class="no-padding-popover"
          trigger="focus">
          <div class="pwd-popover-content">
            <div class="box">
              <span class="text">密码强度</span>
              <i
                v-for="i in 3"
                :key="i"
                :class="{active: i <= rankIndex}"
                class="item" />
            </div>
            <div class="desc">
              <span class="text">密码由8~20位字母、数字、特殊字符组成</span>
              <span
                v-if="rankIndex >= 2"
                class="icon wk wk-success" />
              <span
                v-else
                class="icon error wk wk-close" />
            </div>
          </div>
          <div
            slot="reference"
            class="pwd-popover-control">
            <el-input
              ref="password"
              v-model="form.password"
              :maxlength="20"
              :class="{error: !validateRes.password}"
              placeholder="请输入密码"
              type="password"
              @input.native="calcRank"
              @focus="focusKey = 'password'"
              @blur="checkFromItem('password', form.password)" />
          </div>
        </el-popover>
      </div>

      <div class="row">
        <el-input
          ref="re_password"
          :class="{error: !validateRes.re_password}"
          v-model="form.re_password"
          type="password"
          placeholder="确认密码" />
      </div>
    </template>

    <!--<div
      :class="{ok: !Boolean(errorInfo)}"
      class="error-info">
      <div
        v-if="errorInfo"
        class="box">
        <img
          src="~@/assets/login/error.png"
          alt=""
          class="icon">
        <span>{{ errorInfo }}</span>
      </div>
    </div>-->

    <el-button
      :class="{special: showNextStep}"
      :disabled="disabledBtn || !agreeLaw"
      class="register-btn"
      @click="handleNextStep">
      {{ showNextStep ? '完成注册' : '下一步' }}
    </el-button>

    <template v-if="!showNextStep">
      <div class="center-tips">
        <span>已有账号，</span>
        <span
          class="special" @click="$emit('toggle', 'LoginByPwd', form.phone)">去登录</span>
      </div>
    </template>
    <template v-else>
      <div class="center-tips">
        <span
          class="special"
          @click="showNextStep = false">
          返回上一步
        </span>
      </div>
    </template>

    <el-dialog
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      title="悟空CRM用户隐私保护协议">
      <div class="service-doc">
        &nbsp;&nbsp;请用户务必审慎阅读、充分理解各条款内容，以及开通或使用某项服务的单独协议，并选择接受或不接受。
        <br>&nbsp;&nbsp;除非用户已阅读并接受本协议所有条款，否则用户无权下载或使用悟空CRM相关服务。用户的下载、使用、登录等行为即视为已阅读并同意上述的约束。
        <br>1.本协议的范围
        <br>&nbsp;&nbsp;本协议适用主体范围： 本协议是您作为用户，与郑州卡卡罗特软件科技有限公司（以下简称 “卡卡罗特”）之间关于使用卡卡罗特相关服务所订立的协议。
        <br>2. 关于本服务
        <br>&nbsp;&nbsp;2.1本服务内容是指卡卡罗特通过互联网向用户提供的悟空CRM软件使用权。
        <br>&nbsp;&nbsp;2.2 本服务的形式
        <br>&nbsp;&nbsp;2.2.1 用户使用本服务需要登陆、注册、填写其他表单，就本服务，卡卡罗特给予用户一项不可转让及非排他性的许可。用户仅可为访问或使用本服务的目的而使用这些内容及服务。
        <br>&nbsp;&nbsp;2.2.2 本服务中软件提供包括但不限于移动端和PC端等多个应用版本，用户应选择与所使用环境相匹配的产品版本。
        <br>&nbsp;&nbsp;2.3 本服务的范围
        <br>&nbsp;&nbsp;2.3.1 本条及本协议其他条款未明示授权的其他一切权利仍由卡卡罗特保留，用户在行使这些权利时须另外取得卡卡罗特的书面许可。卡卡罗特如果未行使前述任何权利，并不构成对该权利的放弃。
        <br>&nbsp;&nbsp;2.3.2 如果用户停止使用本服务，或服务被终止或取消，卡卡罗特可以从服务器删除您的数据。服务停止、终止或取消后，卡卡罗特没有义务向用户返还任何数据。
        <br>3. 隐私声明
        <br>&nbsp;&nbsp;3.1	用户信息收集
        <br>&nbsp;&nbsp;3.1.1我们通过网站收集信息，例如，当您申请免费试用或演示，注册网络研讨会，联系我们，订阅我们的电子邮件通讯，下载产品内容（例如产品白皮书）或注册试用我们的软件服务。
        <br>&nbsp;&nbsp;3.1.2当您自愿提供信息时，卡卡罗特会收集您的位置或您首选的通信方式等信息。除非与个人数据结合使用，否则此信息不会识别您或本网站的任何其他用户。
        <br>&nbsp;&nbsp;3.1.2为了增强我们为您提供相关营销，优惠和服务的能力，我们从其他来源获取有关您的信息，例如公共数据库，联合营销合作伙伴，社交媒体平台以及其他第三方。
        <br>&nbsp;&nbsp;3.1.3大多数浏览器或通过您的设备自动收集某些信息，例如您的媒体访问控制（MAC）地址，计算机类型（Windows或Macintosh），屏幕分辨率，操作系统名称和版本，设备制造商和模型，语言，Internet浏览器类型和版本，以及您正在使用的站点（例如应用程序）的名称和版本。您的“IP地址”是一个自动分配给您的Internet服务提供商（ISP）使用的计算机的号码。无论何时访问站点，都可以在我们的服务器日志文件中自动识别和记录IP地址，以及访问时间和您访问的页面。收集IP地址是标准做法，由许多网站，应用程序和其他服务自动完成。 卡卡罗特使用IP地址来计算站点的使用级别，帮助诊断其服务器的问题，管理站点以及监控导航到卡卡罗特站点的区域。
        <br>&nbsp;&nbsp;3.1.4当您下载和使用应用程序时，我们和我们的服务提供商会跟踪和收集应用程序使用数据，例如设备上的应用程序访问我们的服务器的日期和时间以及已下载的信息和文件根据您的设备号码。
        <br>&nbsp;&nbsp;3.1.5通过Cookie和其他类似技术：“Cookie”包括小文件形式的常用信息，这些信息放置在个人设备上，使个人能够更轻松地与网站进行通信和交互。当您访问我们的网站时，我们可能会向您的设备发送一个或多个Cookie。它们使我们能够存储有关您设备的信息，这有助于我们在您浏览我们的网站时提供良好的体验，并提高您提供的服务和功能。卡卡罗特识别有关跟踪机制的自动浏览器信号，其中可能包括“不跟踪”指令。
        <br>&nbsp;&nbsp;3.1.6汇总的个人数据不会识别您或网站的任何其他用户（例如，我们可能汇总个人数据以计算具有特定电话区号的用户的百分比）。
        <br>&nbsp;&nbsp;3.2 用户信息的披露和使用
        <br>&nbsp;&nbsp;3.2.1 卡卡罗特将通过您对本服务的行为来收集相关信息，并以此为您提供更加深入的支持与服务。
        <br>&nbsp;&nbsp;3.2.2 卡卡罗特不会向任何无关第三方提供，出售，出租，分享和交易用户的个人信息，但为方便您使用卡卡罗特服务，卡卡罗特将对您及（或）您的公司的身份和交易数据进行综合统计，卡卡罗特不会披露任何可能用以识别用户的个人身份的资料，但从用户的用户名或其它可披露资料分析得出的资料不受此限。
        <br>&nbsp;&nbsp;3.2.3 您同意卡卡罗特可披露或使用您的个人信息以用于识别和（或）确认您的身份，或解决争议，或有助于确保服务安全，限制欺诈、非法或其他刑事犯罪活动。
        <br>&nbsp;&nbsp;3.2.4 您同意卡卡罗特可披露或使用您的个人信息以保护您的生命、财产之安全或为防止严重侵害他人之合法权益或为公共利益之需要。
        <br>&nbsp;&nbsp;3.2.5 您同意卡卡罗特可披露或使用您的个人信息以改进卡卡罗特的服务，并使卡卡罗特的服务能符合您的要求，从而使您在使用卡卡罗特服务时得到好的使用体验。
        <br>&nbsp;&nbsp;3.2.6 您同意卡卡罗特利用您的个人信息与您联络，并向您提供您可能感兴趣的信息，如：介绍产品、服务、促销优惠或者商业投资机会的商业性短信息等，您接受本条款中的隐私声明即为明示同意收取这些信息。
        <br>&nbsp;&nbsp;3.2.7 当卡卡罗特被法律强制或依照政府或依权利人因识别涉嫌侵权行为人的要求而提供您的信息时，卡卡罗特将善意地披露您的资料。
        <br>&nbsp;&nbsp;3.2.8 您同意如果卡卡罗特拟进行企业并购、重组、出售全部或部分股份和/或资产时，卡卡罗特有权在与前述交易的相关方签署保密协议的前提下向其披露您的资料以协助卡卡罗特完成该等交易。
        <br>&nbsp;&nbsp;3.2.9您在此同意，在您使用本服务期间，卡卡罗特可以在对您的原始数据、进行信息脱密处理的情况下，将该等信息用于制作及发布行业分析报告、行业交流等非营利性用途。
        <br>&nbsp;&nbsp;3.3 用户信息的存储和交换
        <br>&nbsp;&nbsp;3.3.1 卡卡罗特所收集的用户信息将保存在卡卡罗特的服务器或卡卡罗特的合作产品提供商的服务器上。卡卡罗特将根据本条款中的隐私声明保存收集的用户信息，除非适用法律要求或允许保存长时间，卡卡罗特将在本条款中的隐私声明规定的目的实现后的合理期限内删除卡卡罗特所收集的用户信息。之后，如果为本条款中的隐私声明规定的目的不再需要，卡卡罗特可能在合理时间内完全删除卡卡罗特所保存的用户信息。卡卡罗特不去核实试用用户信息是否正确。尽管有上述规定，卡卡罗特仍可能保存某些解决争议、满足技术和法律要求和维护卡卡罗特的服务的安全完整运行所需的试用用户信息。
        <br>&nbsp;&nbsp;3.4 用户信息安全
        <br>&nbsp;&nbsp;3.4.1 卡卡罗特有相应的安全措施来确保本服务收集的用户信息不丢失，不被滥用和变造。这些安全措施包括但不限于向其它服务器备份数据和对用户密码加密。尽管卡卡罗特有这些安全措施，但请注意在因特网上不存在“完善的安全措施”，因此用户信息可能非因卡卡罗特的原因而丢失，包括但不限于他人非法利用用户资料，用户下载安装的其他软件或访问的其他网站中可能含有病毒、木马程序或其他恶意程序，威胁用户的终端设备信息和数据安全，继而影响本服务的正常使用等。对此，卡卡罗特不承担任何责任。
        <br>&nbsp;&nbsp;3.5 用户对本软件分析结果的使用
        <br>&nbsp;&nbsp;3.5.1 用户在此无条件同意，用户在免费使用卡卡罗特提供的服务期间，本条款中的隐私声明项下的信息及对该等信息的分析结果的所有权由卡卡罗特与用户共同拥有。卡卡罗特建议，用户应当以符合相关法律规定和道德义务的方式使用该等信息。同时，卡卡罗特提醒注意，因包括但不限于技术原因、网络传输质量等原因，导致卡卡罗特对卡卡罗特收集的信息的分析结果可能存在不准确的情况，对于该等不准确所导致的问题或者损失，卡卡罗特不承担任何责任。如果您接受本条款中的隐私声明并把卡卡罗特提供给您的信息、资料集成到您的网站或者应用中，您已经同意并向卡卡罗特保证您所有的终用户同意卡卡罗特收集、使用并分析其信息，并且遵守本条款中的隐私声明的全部规定。
        <br>&nbsp;&nbsp;3.5.2 您在此进一步保证，您不会因为卡卡罗特按照本声明的规定收集、使用、分析、披露收集的信息及对该等信息的分析结果而对卡卡罗特产生任何形式的诉求、投诉等。如果您因本条款中的隐私声明项下的对其信息的收集、使用、披露或者对该等信息的分析以及您对分析结果的使用和处分而致使卡卡罗特遭受任何形式的诉求以及投诉等，您将负责全面给予解决；如果导致卡卡罗特发生任何形式的损失，您将负责给予卡卡罗特赔偿。
        <br>4. 用户行为规范
        <br>&nbsp;&nbsp;4.1 本服务使用规范。除非法律允许或卡卡罗特书面许可，用户使用本服务过程中不得从事下列行为：
        <br>&nbsp;&nbsp;4.1.1 删除本服务关于著作权的信息；
        <br>&nbsp;&nbsp;4.1.2 对本服务进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件的源代码；
        <br>&nbsp;&nbsp;4.1.3 对卡卡罗特拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等；
        <br>&nbsp;&nbsp;4.1.4 对本服务或者本服务运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及本软件运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经卡卡罗特授权的第三方工具/服务接入本软件和相关系统；
        <br>&nbsp;&nbsp;4.1.5 通过修改或伪造软件运行中的指令、数据，增加、删减、变动软件的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论这些行为是否为商业目的；
        <br>&nbsp;&nbsp;4.1.6 通过非卡卡罗特开发、授权的第三方软件、插件、外挂、系统，登录或使用卡卡罗特软件及服务，或制作、发布、传播上述工具；
        <br>&nbsp;&nbsp;4.1.7 自行或者授权他人、第三方软件对本软件及其组件、模块、数据进行干扰；
        <br>&nbsp;&nbsp;4.2 违约处理
        <br>&nbsp;&nbsp;4.2.1 如果卡卡罗特发现或收到他人举报或投诉您违反本协议约定的，卡卡罗特有权视行为情节对您处以包括但不限于警告、限制或禁止使用部分或全部功能、帐号封禁直至注销的处罚。
        <br>&nbsp;&nbsp;4.2.2 您理解并同意，卡卡罗特有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，您应独自承担由此而产生的一切法律责任。
        <br>&nbsp;&nbsp;4.2.3 您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，用户应当独立承担责任；卡卡罗特因此遭受损失的，您也应当一并赔偿。
        <br>5. 其他
        <br>&nbsp;&nbsp;5.1 用户使用本官网即视为您已阅读并同意接受本协议的约束。卡卡罗特有权在必要时修改本协议条款。用户可以在本软件的新版本中查阅相关协议条款。本协议条款变更后，如果用户继续使用本官网，即视为用户已接受修改后的协议。如果用户不接受修改后的协议，应当停止使用本软件。
        <br>&nbsp;&nbsp;5.2本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。
        <br>&nbsp;&nbsp;5.3 若用户和卡卡罗特之间发生任何纠纷或争议，应友好协商解决；协商不成的，用户同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。
        <br>&nbsp;&nbsp;5.4本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。
        <br>&nbsp;&nbsp;5.5本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。
        <br>(整文完)
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SendSmsAPI, RegisterAPI, VerfySmsAPI } from '@/api/login'
import SlideVerify from '@/components/SlideVerify'
import mixins from './mixins'
import { Loading } from 'element-ui'

export default {
  name: 'RegisterAccount',
  components: {
    SlideVerify
  },
  mixins: [mixins],
  data() {
    return {
      form: {},
      positionList: [
        { label: '销售经理', value: '1' },
        { label: '市场/人事经理', value: '2' },
        { label: '客服经理', value: '3' },
        { label: '总经理', value: '4' },
        { label: 'IT经理', value: '5' },
        { label: '运营经理', value: '6' },
        { label: '个人爱好', value: '7' },
        { label: '其他', value: '8' }
      ],
      scaleList: [
        { label: '少于15名员工', value: 1 },
        { label: '16-100名员工', value: 2 },
        { label: '101-500名员工', value: 3 },
        { label: '501-1,000名员工', value: 4 },
        { label: '超过1,000名员工', value: 5 }
      ],
      tradeList: [
        { label: '教育培训行业', value: 1 },
        { label: '金融业', value: 2 },
        { label: '房地产业', value: 3 },
        { label: '批发零售业', value: 4 },
        { label: '物流运输业', value: 5 },
        { label: '租赁和商务服务业', value: 6 },
        { label: '软件和IT信息技术业', value: 7 },
        { label: '文化、体育和娱乐业', value: 8 },
        { label: '制造业', value: 9 },
        { label: '科学研究和技术服务业', value: 10 },
        { label: '其他', value: 11 }
      ],
      areaList: [
        { label: '北京市', value: 1 },
        { label: '天津市', value: 2 },
        { label: '上海市', value: 3 },
        { label: '重庆市', value: 4 },
        { label: '河北省', value: 5 },
        { label: '山西省', value: 6 },
        { label: '辽宁省', value: 7 },
        { label: '吉林省', value: 8 },
        { label: '黑龙江省', value: 9 },
        { label: '江苏省', value: 10 },
        { label: '浙江省', value: 11 },
        { label: '安徽省', value: 12 },
        { label: '福建省', value: 13 },
        { label: '江西省', value: 14 },
        { label: '山东省', value: 15 },
        { label: '河南省', value: 16 },
        { label: '湖北省', value: 17 },
        { label: '湖南省', value: 18 },
        { label: '广东省', value: 19 },
        { label: '海南省', value: 20 },
        { label: '四川省', value: 21 },
        { label: '贵州省', value: 22 },
        { label: '云南省', value: 23 },
        { label: '陕西省', value: 24 },
        { label: '甘肃省', value: 25 },
        { label: '青海省', value: 26 },
        { label: '台湾省', value: 27 },
        { label: '内蒙古自治区', value: 28 },
        { label: '广西壮族自治区', value: 29 },
        { label: '西藏自治区', value: 30 },
        { label: '宁夏回族自治区', value: 31 },
        { label: '新疆维吾尔自治区', value: 32 },
        { label: '香港特别行政区', value: 33 },
        { label: '澳门特别行政区', value: 34 }
      ],

      showSlideVerify: false,
      isUser: false,
      canVerify: true,

      dialogVisible: false,
      dialogWidth: '50%',

      timer: null,
      time: 60,
      second: 60,

      agreeLaw: true,
      showNextStep: false,
      disabledBtn: false,

      validateRes: {
        realname: true,
        company_name: true,
        scale: true,
        trade: true,
        area: true,
        discount: true,
        smscode: true,
        phone: true,
        position: true,
        password: true,
        re_password: true
      },
      errorInfo: '',
      rules: {
        realname: [{ required: true, msg: '姓名不能为空' }],
        company_name: [{ required: true, msg: '企业名称不能为空' }],
        position: [{ required: true, msg: '请选择职位' }],
        scale: [{ required: true, msg: '请选择使用人数' }],
        trade: [{ required: true, msg: '请选择行业' }],
        area: [{ required: true, msg: '请选择地区' }],
        discount: [
          { required: false, reg: /^[0-9]{7}$/, msg: '邀请码格式错误' }
        ],
        phone: [
          { required: true, msg: '手机号码不能为空' },
          { reg: /^1[1-9]\d{9}$/, msg: '请输入正确的手机号码' }
        ],
        smscode: [{ required: true, msg: '短信验证码不能为空' }]
      },

      pwdPopover: false,
      rankIndex: 0,
      width: 0
    }
  },
  watch: {
    showNextStep: {
      handler(val) {
        this.$emit('regist-height-change', val)
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.second = this.time
    }
  },
  created() {
    this.$nextTick(() => {
      this.getWidth()
      if (this.$route.query) {
        this.$set(this.form, 'realname', this.$route.query.name || '')
        this.$set(this.form, 'phone', this.$route.query.mobile || '')
      }
      if (document.body.clientWidth > 1550) {
        this.dialogWidth = '40%'
      } else {
        this.dialogWidth = '60%'
      }
    })
  },
  methods: {
    getWidth() {
      this.width = document.getElementsByClassName(
        'register-box'
      )[0].clientWidth - 120
    },

    sliderSuccess() {
      this.isUser = true
      this.showSlideVerify = false
      this.canVerify = false
    },
    sliderFail() {},
    sliderRefresh() {},
    imgVerifyClick() {
      this.canVerify = this.checkFromItem('phone', this.form.phone)
    },

    getSmsCode() {
      const res = this.checkFromItem('phone', this.form.phone)
      if (!res) return

      if (!this.isUser) {
        this.errorInfo = '请先进行安全验证'
        return
      }

      SendSmsAPI({
        telephone: this.form.phone,
        type: 1
      }).then(() => {
        this.startTimer()
      }).catch()
    },
    /**
     * 发送短信倒计时
     */
    startTimer() {
      if (this.second === this.time) {
        this.second--
      }
      this.timer = setTimeout(() => {
        this.second--
        if (this.second >= 0) {
          this.startTimer()
        } else {
          clearTimeout(this.timer)
          this.timer = null
          this.second = this.time
        }
      }, 1000)
    },

    clearError() {
      this.validateRes = {
        realname: true,
        position: true,
        company_name: true,
        scale: true,
        trade: true,
        area: true,
        discount: true,
        smscode: true,
        phone: true,
        password: true,
        re_password: true
      }
      this.errorInfo = null
    },

    /**
     * 密码强度计算
     */
    calcRank() {
      const pwd = this.form.password
      if (pwd.length < 8) {
        this.rankIndex = 0
        return
      }
      // let reg1 = /[A-Z]/; // 至少一个大写字母
      // let reg2 = /[a-z]/; // 至少一个小写字母
      // let reg3 = /[0-9]/; // 至少一个数字
      // let reg4 = /[~!@#$%^&*()_+`\-={}:";'<>?,.\/]/; // 至少一个特殊字符

      const regArr = [
        /[A-Z]/,
        /[a-z]/,
        /[0-9]/
      ]
      const resArr = []
      regArr.forEach(reg => {
        resArr.push(reg.test(pwd))
      })
      this.rankIndex = resArr.filter(o => o).length
    },

    handleNextStep() {
      const arr = [
        'realname',
        'position',
        'company_name',
        'scale',
        'trade',
        'area',
        'discount',
        'phone',
        'smscode'
      ]
      for (let i = 0; i < arr.length; i++) {
        const res = this.checkFromItem(arr[i], this.form[arr[i]])
        if (!res) return
      }
      if (!this.showNextStep) {
        const loading = Loading.service({
          target: document.querySelector('.login-main-content')
        })
        this.disabledBtn = true
        VerfySmsAPI({
          phone: this.form.phone,
          smsCode: this.form.smscode
        }).then(res => {
          this.disabledBtn = false
          loading.close()
          if (res.data === 1) {
            this.showNextStep = true
          } else {
            this.disabledBtn = false
            this.$message.error('短信验证码错误')
          }
        }).catch(() => {
          loading.close()
        })
      } else {
        this.clearError()
        const pwdReg = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
        if (!this.form.password) {
          this.validateRes.password = false
          this.setError('password', '密码不能为空')
          return
        }
        if (!pwdReg.test(this.form.password)) {
          this.validateRes.password = false
          this.setError('password', '密码必须由8-20位字母、数字组成')
          return
        }
        if (this.form.password !== this.form.re_password) {
          this.validateRes.re_password = false
          this.setError('re_password', '两次密码输入不一致')
          return
        }
        this.createAccount()
      }
    },
    createAccount() {
      const loading = Loading.service({
        target: document.querySelector('.login-main-content')
      })
      const params = Object.assign({}, this.form)
      delete params.re_password
      if (this.$route.query && this.$route.query.source) {
        params.source = this.$route.query.source
      }
      this.disabledBtn = true
      RegisterAPI(params).then(() => {
        this.$message.success('注册成功')
        this.disabledBtn = false
        this.$emit('toggle', 'LoginByPwd', this.$refs.smsCode.form.phone)
        loading.close()
      }).catch(() => {
        this.disabledBtn = false
        loading.close()
      })
    }
  }
}
</script>

<style scoped lang="scss">
// error message
.error-info {
  width: 100%;
  height: 36px;
  padding: 0 40px;
  margin-bottom: 5px;
  margin-top: 10px;
  &.ok {
    margin: 0;
  }

  .box {
    height: 100%;
    font-size: 14px;
    color: #F54848;
    line-height: 16px;
    border: 1px solid #EA3E4A;
    border-radius: $xr-border-radius-base;
    background-color: #FFF2F2;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .icon {
      width: 16px;
      margin-right: 10px;
    }
  }
  // @media screen and (max-width: 1550px) {
  //   height: 36px;
  //   padding: 0 40px;
  //   margin-top: 10px;
  //   margin-bottom: 5px;
  // }
}

.register-box {
  width: 100%;
  padding: 0 40px;

  /deep/ .el-input {
    height: 36px;
    .el-input__inner {
      height: 36px;
      background-color: #F6F6F6;
    }
    &.error .el-input__inner {
      border: 1px solid red;
    }
  }
  /deep/ .el-select {
    width: 100%;
    &:hover .el-input__inner {
      border-color: #f6f6f6;
    }
    &:hover .el-input__inner:focus {
      border-color: #3e6bea;
    }
    &.error {
      border: 1px solid red;
    }
  }

  .cell {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    .cell-box {
      flex: 1;
      &:first-child {
        margin-right: 38px;
      }
    }
    // @media screen and (max-width: 1550px) {
    //   margin-bottom: 10px;
      .cell-box:first-child {
        margin-right: 15px;
      }
    // }
  }

  .row {
    margin-bottom: 10px;
    /deep/ .el-input {
      height: 50px;
      .el-input__inner {
        height: 50px;
      }
    }
    // @media screen and (max-width: 1550px) {
    //   margin-bottom: 10px;
    //   /deep/ .el-input {
    //     height: 50px;
    //     .el-input__inner {
    //       height: 50px;
    //     }
    //   }
    // }
  }

  // 图片验证码
  .verify-picture {
    position: relative;
    width: 100%;
    height: 36px;
    font-size: 12px;
    line-height: 36px;
    background-color: #EEF7FF;
    border-radius: $xr-border-radius-base;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-content: center;
    justify-content: center;
    .icon {
      width: 30px;
      height: 30px;
      margin-left: -10px;
      margin-top: 3px;
    }
    // @media screen and (max-width: 1550px)  {
      // height: 36px;
      // font-size: 12px;
      // line-height: 36px;
      // margin-top: 10px;
      // .icon {
      //   width: 30px;
      //   height: 30px;
      //   margin-left: -10px;
      //   margin-top: 3px;
      // }
    // }

    /*.slide-verify {
      position: absolute;
      top: -200px;
      left: 0;
      z-index: 100;
    }*/
  }

  .sms-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-top: 10px;
    // @media screen and (max-width: 1550px)  {
    //   margin-top: 10px;
    // }
    .el-input {
      width: 250px;
      // @media screen and (max-width: 1550px)  {
      //   width: 250px;
      // }
    }
    .el-button {
      flex: 1;
      font-size: 12px;
      color: white;
      background-color: #3e6bea;
      border-radius: 4px;
      border: 0 none;
      padding: 0;
      margin-left: 20px;

      .btn-content {
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        // @media screen and (max-width: 1550px) {
        //   height: 36px;
        //   line-height: 36px;
        // }
      }
      &:hover,
      &.is-disabled,
      &.is-disabled:hover {
        color: white;
        border-color: #517aec;
        background-color: #517aec;
      }
    }
  }

  .service-law {
    margin-top: 10px;
    font-size: 13px;
    .special {
      color: #3255E6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .register-btn {
    width: 100%;
    height: 42px;
    font-size: 20px;
    color: white;
    text-align: center;
    line-height: 42px;
    background-color: #3E6BEA;
    border-radius: 6px;
    padding: 0;
    cursor: pointer;
    margin-top: 10px;
    &:hover {
      background-color: #517aec;
    }
    &.is-disabled {
      cursor: not-allowed;
    }
    // @media screen and (max-width: 1550px)  {
    //   height: 42px;
    //   line-height: 42px;
    // }
    &.special {
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      // margin-top: 80px;
      // @media screen and (max-width: 1550px) {
      //   height: 50px;
      //   line-height: 50px;
      //   font-size: 20px;
      // }
    }
  }

  .center-tips {
    width: 100%;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    .special {
      color: #3255E6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    // @media screen and (max-width: 1550px) {
    //   font-size: 14px;
    //   margin-top: 10px;
    // }
  }

  .error-info {
    padding: 0;
  }

  // @media screen and (max-width: 1550px) {
  //   padding: 0 40px;
  //   /deep/ .el-input {
  //     height: 36px;
  //     .el-input__inner {
  //       height: 36px;
  //     }
  //   }
  // }
}

.pwd-popover-content {
  width: 100%;
  color: #C5C5C5;
  font-size: 14px;
  padding: 14px;

  .box {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .text {
      margin-right: 10px;
    }

    .item {
      width: 30px;
      height: 5px;
      background-color: #EBEBEB;
      margin-right: 5px;

      &.active {
        background-color: #3E6BEA;
      }
    }
  }

  .desc {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .text {
      flex: 1;
    }

    .icon {
      font-size: 14px;
      color: #33cc45;

      &.error {
        color: #F54848;
      }
    }
  }
}

/deep/ input {
  // border: 1px solid #F6F6F6;
  background-color: #F6F6F6;
  // box-sizing: border-box;
  // -webkit-appearance: none;

  // &:-webkit-autofill {
  //   background-image: none;
  //   -webkit-box-shadow: 0 0 0 1000px #F6F6F6 inset !important;
  //   -webkit-text-fill-color: #333 !important;
  // }

  // &:hover {
  //   border: 1px solid #F6F6F6;
  // }

  &:focus,
  &:hover:focus {
    background-color: white !important;
    // border: 1px solid #3e6bea;
  }

  // &:focus:-webkit-autofill {
  //   -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
  // }

  &::-webkit-input-placeholder {
    color: #C5C5C5;
  }
}

/deep/ .el-dialog {
  .el-dialog__close {
    font-size: 24px !important;
    color: #666;
  }
  .el-dialog__body {
    padding: 10px 20px 20px;
  }
}
.service-doc {
  height: 50vh;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  overflow: auto;
}
</style>
