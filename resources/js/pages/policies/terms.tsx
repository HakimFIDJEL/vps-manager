// pages/policies/terms.tsx

// Necessary imports
import { useMemo } from "react";
import { Head } from "@inertiajs/react";

// Layout
import { PoliciesLayout } from "@/layouts/policies";

// Shadcn UI Components
import { Separator } from "@/components/ui/separator";

export default function Terms() {
	const updatedAt = useMemo(() => "2025-09-20", []);
	const appName = "VPS Manager";
	const operator = "Instance Operator";

	return (
		<PoliciesLayout>
			<Head title="Terms of Service" />

			<h1 className="text-2xl font-semibold">Terms of Service</h1>
			<p>Last updated: {updatedAt}</p>

			<Separator />

			<p>
				These terms govern your use of this instance of {appName}. By accessing it
				you accept these terms.
			</p>

			<Separator />

			<h2 id="definitions" className="text-xl font-semibold mt-2">
				Definitions
			</h2>
			<div className="space-y-2">
				<p>
					<strong>Software:</strong> {appName} and related materials.
				</p>
				<p>
					<strong>Instance:</strong> Any deployment of the Software, private or
					public, controlled by an {operator}.
				</p>
				<p>
					<strong>User:</strong> Any person who accesses or uses a specific Instance.
				</p>
				<p>
					<strong>Operator:</strong> The person or entity who deploys and administers
					a specific Instance; the authors do not operate third party Instances.
				</p>
				<p>
					<strong>Authors:</strong> the individuals or entities who publish the
					Software’s source code; they do not operate third-party Instances.
				</p>
			</div>

			<Separator />

			<h2 id="scope" className="text-xl font-semibold mt-2">
				Scope and nature
			</h2>
			<div className="space-y-2">
				<p>
					The Software is open source and may be self-hosted or otherwise deployed at
					the {operator}’s discretion.
				</p>
				<p>
					Each Instance is run by its {operator}, who defines access rules and
					policies for that Instance. The authors do not host or manage third party
					Instances.
				</p>
				<p>
					Access to an Instance is determined solely by its {operator}; the authors
					cannot grant or revoke your access.
				</p>
			</div>

			<Separator />

			<h2 id="eligibility" className="text-xl font-semibold mt-2">
				Eligibility and accounts
			</h2>
			<div className="space-y-2">
				<p>
					You must have lawful authorization to use the account and the system where
					the Instance runs.
				</p>
				<p>
					Authentication methods and access controls are defined by the {operator}.
				</p>
				<p>You are responsible for safeguarding your credentials and sessions.</p>
			</div>

			<Separator />

			<h2 id="acceptable-use" className="text-xl font-semibold mt-2">
				Acceptable use
			</h2>
			<div className="space-y-2">
				<p>No unlawful, infringing or harmful activity.</p>
				<p>
					No attempt to gain unauthorized privileges or access other users’ data.
				</p>
				<p>No interference with host integrity, networks or third party systems.</p>
				<p>Respect resource limits defined by the {operator}.</p>
			</div>

			<Separator />

			<h2 id="execution" className="text-xl font-semibold mt-2">
				Command execution and responsibility
			</h2>
			<div className="space-y-2">
				<p>
					The Software may allow execution of system commands with the privileges of
					the account under which it runs.
				</p>
				<p>
					The {operator} is solely responsible for reviewing and controlling commands
					before use.
				</p>
				<p>
					Improper use may result in data loss, downtime or security issues. The
					authors bear no responsibility for such outcomes.
				</p>
				<p>
					If you do not trust the Software, you are strongly advised not to use it.
				</p>
				<p>
					It is recommended to review the source code to understand how commands are
					handled, and to consult logs when available.
				</p>
			</div>

			<Separator />

			<h2 id="third-parties" className="text-xl font-semibold mt-2">
				Third party components
			</h2>

			<div className="space-y-2">
				<p>
					The Instance may interact with Docker Compose, and other open source tools.
					These components are governed by their own licenses and terms. The{" "}
					{operator}
					does not control external images pulled from registries.
				</p>
			</div>

			<Separator />

			<h2 id="data" className="text-xl font-semibold mt-2">
				Data, logs and privacy
			</h2>
			<div className="space-y-2">
				<p>
					Operational data may include project metadata, paths, environment
					variables, compose content and command outputs.
				</p>
				<p>
					System and application logs may be retained for security and
					troubleshooting.
				</p>
				<p>
					Sensitive secrets should be stored responsibly. Avoid placing credentials
					in logs or labels.
				</p>
				<p>
					The {operator} defines retention and backup policies for this Instance.
				</p>
			</div>

			<Separator />

			<h2 id="security" className="text-xl font-semibold mt-2">
				Security
			</h2>
			<div className="space-y-2">
				<p>
					The Software aims for secure defaults but cannot guarantee absolute
					security.
				</p>
				<p>
					Report vulnerabilities privately using the method indicated in the Security
					Policy.
				</p>
				<p>
					No remediation timeline is guaranteed. Fixes are provided at the {operator}
					's discretion.
				</p>
			</div>

			<Separator />

			<h2 id="updates" className="text-xl font-semibold mt-2">
				Updates and changes
			</h2>
			<div className="space-y-2">
				<p>The {operator} may update, disable or remove features at any time.</p>
				<p>
					You may choose to use any available version of the Software at your own
					risk.
				</p>
				<p>
					It is strongly recommended to keep the Software up to date to benefit from
					fixes and improvements.
				</p>
				<p>
					Installing or continuing to use a new version implies acceptance of the
					then-current terms.
				</p>
			</div>

			<Separator />

			<h2 id="availability" className="text-xl font-semibold mt-2">
				Availability
			</h2>
			<div className="space-y-2">
				<p>
					The Software is provided without any service level or support obligation.
					Access to an Instance may be interrupted or degraded at any time due to
					maintenance, incidents or the {operator}'s operational decisions.
				</p>
			</div>

			<Separator />

			<h2 id="disclaimer" className="text-xl font-semibold mt-2">
				Warranty disclaimer
			</h2>
			<div className="space-y-2">
				<p>
					The Software and this Instance are provided as is and as available, without
					warranties of any kind whether express or implied, including but not
					limited to merchantability, fitness for a particular purpose and non
					infringement. Use is at your sole risk.
				</p>
			</div>

			<Separator />

			<h2 id="liability" className="text-xl font-semibold mt-2">
				Limitation of liability
			</h2>
			<div className="space-y-2">
				<p>
					The Software is provided without warranties. The authors are not liable for
					any damages, losses or issues arising from its use. Each {operator} is
					solely responsible for the deployment, configuration and operation of their
					Instance.
				</p>
			</div>

			<Separator />

			<h2 id="indemnity" className="text-xl font-semibold mt-2">
				Responsibility
			</h2>
			<div className="space-y-2">
				<p>
					By using the Software, you acknowledge that the {operator} assumes all
					risks and liabilities related to their Instance. The authors cannot be held
					responsible for actions performed, data processed or commands executed
					through the Software.
				</p>
			</div>

			<Separator />

			<h2 id="termination" className="text-xl font-semibold mt-2">
				Termination
			</h2>
			<div className="space-y-2">
				<p>
					Access to an Instance is entirely managed by its Operator. The authors
					cannot suspend or revoke access. If the Operator disables or removes an
					Instance, your access will end accordingly.
				</p>
			</div>

			<Separator />

			<h2 id="governing-law" className="text-xl font-semibold mt-2">
				Governing law
			</h2>
			<div className="space-y-2">
				<p>
					These terms are governed by the laws of France. Any dispute shall be
					brought before the competent courts in France.
				</p>
			</div>

			<Separator />

			<h2 id="contact" className="text-xl font-semibold mt-2">
				Contact
			</h2>
			<div className="space-y-2">
				<p>
					For questions regarding these terms or to report a security concern, please
					contact the author through GitHub by opening an issue in the repository.
				</p>
			</div>
		</PoliciesLayout>
	);
}
